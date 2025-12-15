# 트랜잭션 보상 기능 DB 변경 사항 요약

## 📋 개요
2단계 저장 패턴 및 보상 트랜잭션 지원을 위한 데이터베이스 스키마 변경

작성일: 2025.12.09

---

## 🔄 변경된 테이블

### 1. DEPOSIT 테이블

#### 변경 사항
- **DEPOSIT_STATUS 컬럼 수정**
  - 기존 값: `PAID`, `REFUNDED`, `PARTIAL_REFUNDED`
  - 추가 값: `PENDING` (결제 대기 상태)
  - DEFAULT 값 변경: `PAID` → `PENDING`

#### 추가된 인덱스
```sql
CREATE INDEX IDX_DEPOSIT_STATUS_DATE 
    ON DEPOSIT(DEPOSIT_STATUS, PAYMENT_DATE);
```

#### 추가된 제약조건
```sql
ALTER TABLE DEPOSIT 
    ADD CONSTRAINT CHK_DEPOSIT_STATUS 
    CHECK (DEPOSIT_STATUS IN ('PENDING', 'PAID', 'REFUNDED', 'PARTIAL_REFUNDED'));
```

#### 변경 이유
- **2단계 저장 패턴 지원**: PENDING 상태로 먼저 저장 후 Toss API 호출 성공 시 PAID로 변경
- **데이터 일관성 보장**: 외부 API 호출 실패 시에도 DB 상태 추적 가능
- **정리 작업 최적화**: 24시간 이상 PENDING 상태인 레코드를 스케줄러로 정리

---

### 2. REFUND_RETRY_HISTORY 테이블

#### 추가된 컬럼

1. **RETRY_TYPE** (VARCHAR(20), NOT NULL, DEFAULT 'REFUND')
   - `REFUND`: 일반 환불 재시도
   - `COMPENSATION`: 보상 트랜잭션 (Toss 취소 후 Deposit 삭제)
   
2. **TOSS_PAYMENT_KEY** (VARCHAR(255), NULL)
   - 보상 트랜잭션 실행 시 Toss 결제 취소에 필요한 키 저장

#### 추가된 인덱스
```sql
CREATE INDEX IDX_RETRY_TYPE_STATUS 
    ON REFUND_RETRY_HISTORY(RETRY_TYPE, RETRY_STATUS);
```

#### 추가된 제약조건
```sql
ALTER TABLE REFUND_RETRY_HISTORY 
    ADD CONSTRAINT CHK_RETRY_TYPE 
    CHECK (RETRY_TYPE IN ('REFUND', 'COMPENSATION'));
```

#### 변경 이유
- **보상 트랜잭션 추적**: DB 저장 실패 시 Toss 결제를 취소하는 보상 로직 이력 관리
- **재시도 타입 구분**: 일반 환불과 보상 트랜잭션을 명확히 구분하여 처리
- **스케줄러 최적화**: 재시도 타입별로 다른 로직 실행 가능

---

## 📊 테이블 구조 (변경 후)

### DEPOSIT 테이블
```sql
CREATE TABLE DEPOSIT (
    DEPOSIT_ID INT NOT NULL AUTO_INCREMENT,
    PARTY_ID INT NOT NULL,
    PARTY_MEMBER_ID INT NOT NULL,
    USER_ID VARCHAR(50) NOT NULL,
    DEPOSIT_TYPE VARCHAR(20) NOT NULL DEFAULT 'SECURITY',
    DEPOSIT_AMOUNT INT NOT NULL,
    DEPOSIT_STATUS VARCHAR(20) NOT NULL DEFAULT 'PENDING',  -- ✨ 변경됨
    PAYMENT_DATE DATETIME NOT NULL,
    REFUND_DATE DATETIME NULL,
    REFUND_AMOUNT INT NULL,
    TRANSACTION_DATE DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    TOSS_PAYMENT_KEY VARCHAR(255) NULL,
    ORDER_ID VARCHAR(100) NULL,
    
    PRIMARY KEY (DEPOSIT_ID),
    INDEX IDX_DEPOSIT_STATUS_DATE (DEPOSIT_STATUS, PAYMENT_DATE),  -- ✨ 추가됨
    CONSTRAINT CHK_DEPOSIT_STATUS CHECK (DEPOSIT_STATUS IN ('PENDING', 'PAID', 'REFUNDED', 'PARTIAL_REFUNDED'))  -- ✨ 추가됨
) COMMENT='보증금 정보 (LEADER/SECURITY 타입)';
```

### REFUND_RETRY_HISTORY 테이블
```sql
CREATE TABLE REFUND_RETRY_HISTORY (
    RETRY_ID INT NOT NULL AUTO_INCREMENT,
    DEPOSIT_ID INT NOT NULL,
    TOSS_PAYMENT_KEY VARCHAR(255) NULL,  -- ✨ 추가됨
    ATTEMPT_NUMBER INT NOT NULL DEFAULT 1,
    ATTEMPT_DATE DATETIME NOT NULL,
    RETRY_STATUS VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    RETRY_TYPE VARCHAR(20) NOT NULL DEFAULT 'REFUND',  -- ✨ 추가됨
    NEXT_RETRY_DATE DATETIME NULL,
    REFUND_AMOUNT INT NULL,
    REFUND_REASON VARCHAR(200) NULL,
    ERROR_CODE VARCHAR(50) NULL,
    ERROR_MESSAGE VARCHAR(500) NULL,
    CREATED_AT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (RETRY_ID),
    INDEX IDX_REFUND_RETRY_DEPOSIT (DEPOSIT_ID),
    INDEX IDX_REFUND_RETRY_STATUS (RETRY_STATUS),
    INDEX IDX_RETRY_TYPE_STATUS (RETRY_TYPE, RETRY_STATUS),  -- ✨ 추가됨
    CONSTRAINT CHK_RETRY_TYPE CHECK (RETRY_TYPE IN ('REFUND', 'COMPENSATION'))  -- ✨ 추가됨
) COMMENT='환불 재시도 이력 (보증금 환불 실패 시 최대 4회 시도 추적)';
```

---

## 🔧 마이그레이션 실행 방법

### 1. 백업 (필수)
```sql
-- 변경 전 테이블 백업
CREATE TABLE DEPOSIT_BACKUP AS SELECT * FROM DEPOSIT;
CREATE TABLE REFUND_RETRY_HISTORY_BACKUP AS SELECT * FROM REFUND_RETRY_HISTORY;
```

### 2. 마이그레이션 실행
```bash
# MySQL 접속
mysql -u [username] -p [database_name]

# 마이그레이션 SQL 실행
source /path/to/migration_transaction_compensation.sql
```

### 3. 검증
```sql
-- DEPOSIT 테이블 구조 확인
DESCRIBE DEPOSIT;

-- REFUND_RETRY_HISTORY 테이블 구조 확인
DESCRIBE REFUND_RETRY_HISTORY;

-- 인덱스 확인
SHOW INDEX FROM DEPOSIT;
SHOW INDEX FROM REFUND_RETRY_HISTORY;

-- 제약조건 확인
SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
WHERE TABLE_NAME IN ('DEPOSIT', 'REFUND_RETRY_HISTORY');
```

---

## 📈 영향받는 기능

### 1. DepositService
- `createDeposit()`: PENDING 상태로 먼저 저장 후 Toss 호출
- `refundDeposit()`: 실패 시 REFUND 타입으로 재시도 이력 저장
- 새로운 메서드: `deleteById()`, `deleteStalePendingRecords()`

### 2. RefundRetryService
- `recordFailure()`: REFUND 타입으로 실패 이력 저장
- `registerCompensation()`: COMPENSATION 타입으로 보상 트랜잭션 등록
- `retryRefund()`: RETRY_TYPE에 따라 다른 로직 실행

### 3. PartyService
- `joinParty()`: DB 실패 시 보상 트랜잭션 등록
- `processLeaderDeposit()`: 2단계 저장 패턴 적용

### 4. 새로운 스케줄러
- `PendingDepositCleanupScheduler`: 24시간 이상 PENDING 상태인 Deposit 정리
- `RefundRetryScheduler`: RETRY_TYPE별로 다른 재시도 로직 실행

---

## ⚠️ 주의사항

### 1. 기존 데이터 호환성
- 기존 DEPOSIT 레코드는 모두 PAID 상태로 유지됨
- 기존 REFUND_RETRY_HISTORY 레코드는 자동으로 REFUND 타입으로 설정됨

### 2. 애플리케이션 배포 순서
1. DB 마이그레이션 먼저 실행
2. 애플리케이션 재배포
3. 스케줄러 동작 확인

### 3. 롤백 계획
```sql
-- DEPOSIT 테이블 롤백
ALTER TABLE DEPOSIT DROP CONSTRAINT CHK_DEPOSIT_STATUS;
ALTER TABLE DEPOSIT DROP INDEX IDX_DEPOSIT_STATUS_DATE;
ALTER TABLE DEPOSIT MODIFY COLUMN DEPOSIT_STATUS VARCHAR(20) NOT NULL DEFAULT 'PAID';

-- REFUND_RETRY_HISTORY 테이블 롤백
ALTER TABLE REFUND_RETRY_HISTORY DROP CONSTRAINT CHK_RETRY_TYPE;
ALTER TABLE REFUND_RETRY_HISTORY DROP INDEX IDX_RETRY_TYPE_STATUS;
ALTER TABLE REFUND_RETRY_HISTORY DROP COLUMN TOSS_PAYMENT_KEY;
ALTER TABLE REFUND_RETRY_HISTORY DROP COLUMN RETRY_TYPE;
```

---

## 📝 관련 문서
- 요구사항: `.kiro/specs/transaction-compensation/requirements.md`
- 설계 문서: `.kiro/specs/transaction-compensation/design.md`
- 구현 계획: `.kiro/specs/transaction-compensation/tasks.md`

---

## ✅ 체크리스트

- [ ] DB 백업 완료
- [ ] 마이그레이션 SQL 실행
- [ ] 테이블 구조 검증
- [ ] 인덱스 생성 확인
- [ ] 제약조건 확인
- [ ] 애플리케이션 재배포
- [ ] 기능 테스트 완료
- [ ] 스케줄러 동작 확인
