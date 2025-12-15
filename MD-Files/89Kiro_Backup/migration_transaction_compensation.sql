-- ============================================
-- 트랜잭션 보상 기능 DB 마이그레이션
-- 작성일: 2025.12.09
-- 설명: 2단계 저장 패턴 및 보상 트랜잭션 지원을 위한 스키마 변경
-- ============================================

-- ============================================
-- 1. DEPOSIT 테이블 수정
-- ============================================

-- 1.1 PENDING 상태 추가를 위한 DEPOSIT_STATUS 컬럼 수정
-- 기존: PAID, REFUNDED, PARTIAL_REFUNDED
-- 추가: PENDING (결제 대기 상태)
ALTER TABLE DEPOSIT 
    MODIFY COLUMN DEPOSIT_STATUS VARCHAR(20) NOT NULL DEFAULT 'PENDING'
    COMMENT 'PENDING: 결제대기, PAID: 결제완료, REFUNDED: 환불완료, PARTIAL_REFUNDED: 부분환불';

-- 1.2 DEPOSIT 테이블 인덱스 추가 (PENDING 상태 조회 최적화)
CREATE INDEX IDX_DEPOSIT_STATUS_DATE 
    ON DEPOSIT(DEPOSIT_STATUS, PAYMENT_DATE);

-- ============================================
-- 2. REFUND_RETRY_HISTORY 테이블 수정
-- ============================================

-- 2.1 retry_type 컬럼 추가
-- REFUND: 일반 환불 재시도
-- COMPENSATION: 보상 트랜잭션 (Toss 취소 후 Deposit 삭제)
ALTER TABLE REFUND_RETRY_HISTORY 
    ADD COLUMN RETRY_TYPE VARCHAR(20) NOT NULL DEFAULT 'REFUND'
    COMMENT 'REFUND: 일반환불, COMPENSATION: 보상트랜잭션'
    AFTER RETRY_STATUS;

-- 2.2 retry_type 인덱스 추가 (재시도 타입별 조회 최적화)
CREATE INDEX IDX_RETRY_TYPE_STATUS 
    ON REFUND_RETRY_HISTORY(RETRY_TYPE, RETRY_STATUS);

-- 2.3 toss_payment_key 컬럼 추가 (보상 트랜잭션용)
ALTER TABLE REFUND_RETRY_HISTORY 
    ADD COLUMN TOSS_PAYMENT_KEY VARCHAR(255) NULL
    COMMENT '토스 결제 키 (보상 트랜잭션 취소용)'
    AFTER DEPOSIT_ID;

-- ============================================
-- 3. 기존 데이터 마이그레이션
-- ============================================

-- 3.1 기존 REFUND_RETRY_HISTORY 레코드의 retry_type을 REFUND로 설정
UPDATE REFUND_RETRY_HISTORY 
SET RETRY_TYPE = 'REFUND' 
WHERE RETRY_TYPE IS NULL OR RETRY_TYPE = '';

-- 3.2 기존 DEPOSIT 레코드 중 PAYMENT_DATE가 NULL인 경우 현재 시간으로 설정
UPDATE DEPOSIT 
SET PAYMENT_DATE = CURRENT_TIMESTAMP 
WHERE PAYMENT_DATE IS NULL;

-- ============================================
-- 4. 제약조건 및 검증
-- ============================================

-- 4.1 DEPOSIT_STATUS 값 검증
ALTER TABLE DEPOSIT 
    ADD CONSTRAINT CHK_DEPOSIT_STATUS 
    CHECK (DEPOSIT_STATUS IN ('PENDING', 'PAID', 'REFUNDED', 'PARTIAL_REFUNDED'));

-- 4.2 RETRY_TYPE 값 검증
ALTER TABLE REFUND_RETRY_HISTORY 
    ADD CONSTRAINT CHK_RETRY_TYPE 
    CHECK (RETRY_TYPE IN ('REFUND', 'COMPENSATION'));

-- ============================================
-- 5. 마이그레이션 검증 쿼리
-- ============================================

-- 5.1 PENDING 상태 Deposit 조회
-- SELECT * FROM DEPOSIT WHERE DEPOSIT_STATUS = 'PENDING';

-- 5.2 보상 트랜잭션 재시도 이력 조회
-- SELECT * FROM REFUND_RETRY_HISTORY WHERE RETRY_TYPE = 'COMPENSATION';

-- 5.3 24시간 이상 PENDING 상태인 Deposit 조회 (정리 대상)
-- SELECT * FROM DEPOSIT 
-- WHERE DEPOSIT_STATUS = 'PENDING' 
--   AND PAYMENT_DATE < DATE_SUB(NOW(), INTERVAL 24 HOUR);

-- ============================================
-- 마이그레이션 완료
-- ============================================
