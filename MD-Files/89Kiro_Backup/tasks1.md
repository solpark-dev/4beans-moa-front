# Implementation Plan

## Week 1: 기반 구조 + DepositService

- [x] 1. DB 마이그레이션 및 도메인 수정


  - [x] 1.1 DepositStatus enum에 PENDING 상태 추가


    - `DepositStatus.java`에 `PENDING("결제대기")` 추가
    - _Requirements: 6.1_
  - [x] 1.2 RefundRetryHistory 도메인에 retryType 필드 추가


    - `RefundRetryHistory.java`에 `private String retryType;` 추가
    - _Requirements: 5.1_
  - [x] 1.3 RefundRetryHistoryMapper.xml 수정


    - ResultMap에 retryType 매핑 추가
    - INSERT/UPDATE 쿼리에 retry_type 컬럼 추가
    - _Requirements: 5.1_

  - [x] 1.4 DB 마이그레이션 SQL 작성

    - `REFUND_RETRY_HISTORY` 테이블에 `retry_type` 컬럼 추가
    - 인덱스 추가: `idx_retry_type_status`
    - _Requirements: 5.1_

- [x] 2. RefundRetryService 확장


  - [x] 2.1 RefundRetryService 인터페이스에 신규 메서드 추가


    - `recordFailure(Deposit deposit, Exception e, String reason)`
    - `registerCompensation(Integer depositId, String tossPaymentKey, Integer amount, String reason)`
    - _Requirements: 1.3, 2.3_
  - [x] 2.2 RefundRetryServiceImpl에 recordFailure 구현


    - `@Transactional(propagation = Propagation.REQUIRES_NEW)` 적용
    - retryType = "REFUND"로 저장
    - _Requirements: 2.1, 2.2_
  - [x] 2.3 Property test: 트랜잭션 롤백 후 이력 보존



    - **Property 5: 환불 실패 이력 트랜잭션 독립성**
    - **Validates: Requirements 2.1, 2.2**
  - [x] 2.4 RefundRetryServiceImpl에 registerCompensation 구현

    - `@Transactional(propagation = Propagation.REQUIRES_NEW)` 적용
    - retryType = "COMPENSATION"으로 저장
    - _Requirements: 1.3_
  - [x] 2.5 retryRefund 메서드에 retryType 분기 처리 추가




    - COMPENSATION: Toss 취소 후 Deposit 삭제
    - REFUND: 기존 환불 재시도 로직
    - _Requirements: 5.2, 5.3, 5.4_
  - [x] 2.6 Property test: retryType 분기 처리


    - **Property 11: retryType 분기 처리**
    - **Validates: Requirements 5.2, 5.3, 5.4**

- [x] 3. Checkpoint - 테스트 통과 확인



  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. DepositService 수정

  - [x] 4.1 DepositDao에 deleteById, deleteStalePendingRecords 메서드 추가


    - `void deleteById(Integer depositId)`
    - `void deleteStalePendingRecords(LocalDateTime cutoffTime)`
    - _Requirements: 6.2_
  - [x] 4.2 DepositMapper.xml에 DELETE 쿼리 추가

    - deleteById, deleteStalePendingRecords 쿼리 작성
    - _Requirements: 6.2_

  - [x] 4.3 createDeposit 메서드에 2단계 저장 패턴 적용

    - PENDING 상태로 먼저 INSERT
    - Toss 호출 후 PAID로 UPDATE
    - DB 실패 시 registerCompensation 호출
    - _Requirements: 1.1, 1.2, 1.3_
  - [ ]* 4.4 Property test: 2단계 저장 패턴
    - **Property 1: 2단계 저장 패턴 - PENDING 상태 생성**
    - **Property 2: 2단계 저장 패턴 - PAID 상태 전환**
    - **Validates: Requirements 1.1, 1.2**
  - [x] 4.5 refundDeposit 메서드 예외 처리 개선

    - catch 블록에서 refundRetryService.recordFailure() 호출
    - REQUIRES_NEW로 실패 이력 저장
    - _Requirements: 2.1, 2.3_

  - [x] 4.6 processWithdrawalRefund 환불 정책 간소화


    - 2일 전: 전액 환불
    - 1일 전부터: 전액 몰수
    - partialRefundDeposit 호출 제거
    - _Requirements: 4.1, 4.2_
  - [ ]* 4.7 Property test: 환불 정책 분기
    - **Property 10: 환불 정책 - 날짜 기반 분기**
    - **Validates: Requirements 4.1, 4.2**
  - [x] 4.8 DepositService 인터페이스에서 partialRefundDeposit 제거

    - 인터페이스와 구현체 모두에서 메서드 삭제
    - _Requirements: 4.3_

- [x] 5. Checkpoint - 테스트 통과 확인

  - Ensure all tests pass, ask the user if questions arise.

## Week 2: PartyService + 정산 스케줄러 + 프론트엔드


- [ ] 6. PartyServiceImpl 동시성 제어 개선
  - [x] 6.1 joinParty 메서드 순서 변경


    - incrementCurrentMembers를 Toss 호출 전으로 이동
    - Toss 실패 시 decrementCurrentMembers 호출
    - DB 실패 시 registerCompensation + decrementCurrentMembers
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [ ]* 6.2 Property test: 정원 증가 우선 실행
    - **Property 6: 정원 증가 우선 실행**
    - **Property 7: 만석 시 Toss 미호출**
    - **Validates: Requirements 3.1, 3.2**
  - [ ]* 6.3 Property test: 실패 시 정원 복구
    - **Property 8: Toss 실패 시 정원 복구**
    - **Property 9: DB 실패 시 정원 복구 및 보상 등록**
    - **Validates: Requirements 3.3, 3.4**
  - [x] 6.4 processLeaderDeposit 메서드에 2단계 저장 패턴 적용


    - createDeposit 호출 시 이미 2단계 저장 적용됨
    - DB 실패 시 보상 트랜잭션 등록
    - _Requirements: 1.1, 1.2, 1.3_


- [ ] 7. 정산 스케줄러 기간 계산 수정
  - [x] 7.1 SettlementServiceImpl 정산 기간 계산 로직 수정


    - 이전 완료된 billing cycle만 정산하도록 변경
    - 현재 날짜 이전의 기간만 포함
    - _Requirements: 9.1, 9.2, 9.3_
  - [ ]* 7.2 Property test: 정산 기간 정확성
    - **Property 14: 정산 기간 정확성**
    - **Validates: Requirements 9.1, 9.2, 9.3**


- [x] 8. Checkpoint - 테스트 통과 확인

  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. 프론트엔드 환불 정책 안내 수정

  - [x] 9.1 LeavePartyWarningModal.jsx 환불 정책 안내 수정


    - "파티 시작 2일 전까지 전액 환불, 1일 전부터 환불 불가" 문구로 변경
    - _Requirements: 7.1, 7.2_


## Week 3: 모니터링 + 안정화

- [-] 10. PENDING 상태 정리 스케줄러 추가

  - [x] 10.1 PendingDepositCleanupScheduler 클래스 생성

    - 매일 새벽 3시 실행 (`@Scheduled(cron = "0 0 3 * * *")`)
    - 24시간 이상 PENDING 상태인 Deposit 삭제
    - 삭제 전 관련 COMPENSATION 재시도 상태 확인
    - _Requirements: 6.2, 6.3_
  - [ ]* 10.2 Property test: PENDING 상태 정리
    - **Property 12: PENDING 상태 정리**
    - **Validates: Requirements 6.2**


- [-] 11. 보상 트랜잭션 최종 실패 알림

  - [x] 11.1 RefundRetryServiceImpl에 관리자 알림 로직 추가

    - 4회 재시도 후 실패 시 알림 발송
    - depositId, 금액, 실패 사유 포함
    - _Requirements: 8.1, 8.2_
  - [ ]* 11.2 Property test: 4회 실패 시 알림
    - **Property 13: 4회 실패 시 관리자 알림**
    - **Validates: Requirements 8.1, 8.2**


- [x] 12. COMPENSATION 재시도 시 Toss 취소 확인

  - [x] 12.1 retryCompensation 메서드 구현 완성

    - Toss cancelPayment 호출
    - 성공 시 Deposit 삭제 및 retry 상태 SUCCESS로 변경
    - _Requirements: 1.4_
  - [ ]* 12.2 Property test: COMPENSATION 재시도
    - **Property 4: COMPENSATION 재시도 시 Toss 취소 호출**
    - **Validates: Requirements 1.4**

- [x] 13. Final Checkpoint - 전체 테스트 통과 확인

  - Ensure all tests pass, ask the user if questions arise.
