# Implementation Plan

- [x] 1. 데이터베이스 테이블 생성
  - [x] 1.1 bank_account 테이블 생성
    - 파티장 계좌 정보 저장 테이블 (bank_code, account_num, fintech_use_num 등)
    - _Requirements: 1.4, 5.1_
  - [x] 1.2 account_verification 테이블 생성
    - 1원 인증 세션 관리 테이블 (verify_code, attempt_count, expired_at 등)
    - _Requirements: 1.1, 1.5, 1.6_
  - [x] 1.3 transfer_transaction 테이블 생성
    - 입금이체 거래 기록 테이블 (bank_tran_id, tran_amt, rsp_code 등)
    - _Requirements: 2.3, 3.3, 3.4_

- [ ] 2. Mock 오픈뱅킹 API 서버 구현
  - [x] 2.1 DTO 클래스 생성


    - InquiryReceiveRequest/Response, InquiryVerifyRequest/Response, TransferDepositRequest/Response
    - _Requirements: 2.1_

  - [x] 2.2 MockOpenBankingController 구현

    - POST /mock/openbanking/inquiry/receive (1원 인증 요청)
    - POST /mock/openbanking/inquiry/verify (인증 검증)
    - POST /mock/openbanking/transfer/deposit (입금이체)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 2.3 MockOpenBankingService 구현

    - 인증코드 생성, 검증, 입금이체 Mock 로직
    - _Requirements: 1.1, 1.3, 2.2, 2.3_
  - [ ] 2.4 Property test: 인증코드 생성 일관성
    - **Property 1: 인증코드 생성 일관성**
    - **Validates: Requirements 1.1**
  - [ ] 2.5 Property test: API 응답 형식 준수
    - **Property 4: API 응답 형식 준수**
    - **Validates: Requirements 2.1**
  - [ ] 2.6 Property test: 필수 파라미터 검증
    - **Property 5: 필수 파라미터 검증**
    - **Validates: Requirements 2.4**

- [x] 3. OpenBankingClient 구현

  - [x] 3.1 OpenBankingClient 인터페이스 정의


    - requestVerification(), verifyCode(), transferDeposit() 메서드
    - _Requirements: 2.1_
  - [x] 3.2 MockOpenBankingClient 구현 (@Profile("dev"))


    - WebClient로 Mock 서버 호출
    - _Requirements: 2.1, 2.2, 2.3_

- [ ] 4. Checkpoint - 테스트 확인
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. 계좌 등록 기능 구현 (1원 인증)
  - [x] 5.1 BankAccountMapper 구현


    - 계좌 CRUD, 인증 세션 관리 쿼리
    - _Requirements: 1.4, 5.1_

  - [x] 5.2 BankAccountService 구현

    - requestVerification(): 1원 인증 요청 및 이메일 발송
    - verifyAndRegister(): 인증코드 검증 및 계좌 등록
    - getAccount(), deleteAccount(): 계좌 조회/삭제
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 5.1, 5.2, 5.3, 5.4_

  - [x] 5.3 BankAccountController 구현

    - POST /api/bank-account/verify-request
    - POST /api/bank-account/verify
    - GET /api/bank-account
    - DELETE /api/bank-account
    - _Requirements: 1.1, 1.3, 5.1, 5.4_
  - [ ] 5.4 Property test: 인증코드 검증 정확성
    - **Property 2: 인증코드 검증 정확성**
    - **Validates: Requirements 1.3, 2.2**
  - [ ] 5.5 Property test: 계좌 등록 상태 일관성
    - **Property 3: 계좌 등록 상태 일관성**
    - **Validates: Requirements 1.4**
  - [ ] 5.6 Property test: 계좌번호 마스킹
    - **Property 13: 계좌번호 마스킹**
    - **Validates: Requirements 5.1**

- [ ] 6. 자동 정산 스케줄러 구현
  - [x] 6.1 TransferTransactionMapper 구현

    - 거래 기록 저장/조회 쿼리
    - _Requirements: 2.3, 3.3, 3.4_

  - [x] 6.2 SettlementScheduler 구현

    - @Scheduled(cron = "0 0 10 * * *") 매일 오전 10시 실행
    - 정산 대기 건 조회 → 입금이체 요청 → 상태 업데이트
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  - [ ] 6.3 Property test: 입금이체 거래 기록
    - **Property 6: 입금이체 거래 기록**
    - **Validates: Requirements 2.3**
  - [ ] 6.4 Property test: 정산 성공 시 상태 변경
    - **Property 7: 정산 성공 시 상태 변경**
    - **Validates: Requirements 3.3**
  - [ ] 6.5 Property test: 정산 실패 시 상태 변경
    - **Property 8: 정산 실패 시 상태 변경**
    - **Validates: Requirements 3.4**

- [ ] 7. Checkpoint - 테스트 확인
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. 정산 내역 조회 기능 구현
  - [x] 8.1 SettlementMapper 정산 내역 조회 쿼리 추가

    - 파티장별 정산 내역 조회, 기간 필터링
    - _Requirements: 4.1, 4.4_


  - [ ] 8.2 SettlementService 정산 내역 조회 메서드 추가
    - getSettlementHistory(): 정산 내역 조회 (최신순 정렬, 기간 필터)

    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [x] 8.3 SettlementController 정산 내역 API 추가

    - GET /api/settlements?startDate=&endDate=
    - _Requirements: 4.1, 4.4_
  - [ ] 8.4 Property test: 정산 내역 정렬
    - **Property 9: 정산 내역 정렬**
    - **Validates: Requirements 4.1**
  - [ ] 8.5 Property test: 정산 내역 필수 필드
    - **Property 10: 정산 내역 필수 필드**
    - **Validates: Requirements 4.2**
  - [ ] 8.6 Property test: 실패 정산 사유 포함
    - **Property 11: 실패 정산 사유 포함**
    - **Validates: Requirements 4.3**
  - [ ] 8.7 Property test: 기간 필터링 정확성
    - **Property 12: 기간 필터링 정확성**
    - **Validates: Requirements 4.4**

- [ ] 9. 계좌 관리 기능 구현
  - [x] 9.1 계좌 변경 기능 구현

    - 기존 계좌 비활성화 + 새 계좌 인증 절차
    - _Requirements: 5.2, 5.3_
  - [ ] 9.2 Property test: 계좌 교체 원자성
    - **Property 14: 계좌 교체 원자성**
    - **Validates: Requirements 5.3**
  - [ ] 9.3 Property test: 계좌 삭제 상태 변경
    - **Property 15: 계좌 삭제 상태 변경**
    - **Validates: Requirements 5.4**

- [x] 10. 프론트엔드 구현


  - [x] 10.1 계좌 등록 페이지 구현


    - 은행 선택, 계좌번호 입력, 1원 인증 UI
    - _Requirements: 1.1, 1.3_
  - [x] 10.2 정산 내역 페이지 구현


    - 정산 목록, 기간 필터, 상태별 표시
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [x] 10.3 계좌 관리 UI 구현 (마이페이지)

    - 계좌 정보 표시, 변경/삭제 버튼
    - _Requirements: 5.1, 5.2, 5.4_

  - [x] 10.4 API 연동

    - bankAccountApi.js, settlementApi.js 작성
    - _Requirements: 1.1, 4.1, 5.1_

- [ ] 11. Final Checkpoint - 전체 테스트 확인
  - Ensure all tests pass, ask the user if questions arise.
