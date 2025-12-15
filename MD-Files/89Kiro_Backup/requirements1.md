# Requirements Document

## Introduction

MOA 플랫폼의 트랜잭션 관리 개선 기능입니다. Toss Payments API 호출 성공 후 DB 저장 실패 시 자동 보상 트랜잭션 메커니즘을 구현하여 데이터 일관성을 보장합니다.

핵심 목표:
- Toss Payments 성공 → DB 실패 시 자동 보상 (결제 취소)
- 환불 실패 이력이 트랜잭션 롤백 시에도 보존
- 파티 가입 시 동시성 제어 개선
- 환불 정책 간소화 (50% 부분 환불 제거)

## Glossary

- **Toss Payments**: 결제 대행 서비스 (PG사)
- **보상 트랜잭션 (Compensation Transaction)**: 외부 API 성공 후 내부 DB 실패 시 외부 API 작업을 취소하는 트랜잭션
- **2단계 저장 패턴**: PENDING 상태로 먼저 저장 후 외부 API 호출, 성공 시 PAID로 업데이트하는 패턴
- **REQUIRES_NEW**: Spring 트랜잭션 전파 레벨로, 새로운 독립 트랜잭션을 생성하여 부모 트랜잭션 롤백에 영향받지 않음
- **RefundRetryHistory**: 환불 재시도 이력 테이블
- **retryType**: 재시도 유형 (REFUND: 환불 재시도, COMPENSATION: 보상 트랜잭션)
- **DepositStatus**: 보증금 상태 (PENDING, PAID, REFUNDED, FORFEITED)

## Requirements

### Requirement 1: 보증금 결제 시 2단계 저장 패턴 적용

**User Story:** As a 시스템 관리자, I want Toss 결제 성공 후 DB 실패 시 자동으로 결제가 취소되도록, so that 사용자가 돈만 빠지고 서비스를 받지 못하는 상황을 방지할 수 있다.

#### Acceptance Criteria

1. WHEN 보증금 결제가 시작되면 THE DepositService SHALL PENDING 상태로 Deposit 레코드를 먼저 생성한다
2. WHEN Toss Payments 결제 승인이 성공하면 THE DepositService SHALL Deposit 상태를 PAID로 업데이트한다
3. IF Toss 성공 후 DB 업데이트가 실패하면 THEN THE RefundRetryService SHALL COMPENSATION 타입의 재시도 이력을 등록한다
4. WHEN COMPENSATION 타입 재시도가 실행되면 THE RefundRetryService SHALL Toss cancelPayment API를 호출하여 결제를 취소한다

### Requirement 2: 환불 실패 이력 보존

**User Story:** As a 시스템 관리자, I want 환불 실패 시 이력이 트랜잭션 롤백과 무관하게 보존되도록, so that 재시도 스케줄러가 실패한 환불을 처리할 수 있다.

#### Acceptance Criteria

1. WHEN 환불 실패 이력을 저장할 때 THE RefundRetryService SHALL REQUIRES_NEW 트랜잭션으로 독립적으로 저장한다
2. IF 부모 트랜잭션이 롤백되더라도 THEN THE RefundRetryHistory 레코드 SHALL 데이터베이스에 보존된다
3. WHEN 환불이 실패하면 THE DepositServiceImpl SHALL RefundRetryService.recordFailure()를 호출하여 이력을 저장한다

### Requirement 3: 파티 가입 동시성 제어 개선

**User Story:** As a 파티원, I want 정원이 초과된 파티에 결제가 진행되지 않도록, so that 불필요한 결제 후 환불 과정을 겪지 않는다.

#### Acceptance Criteria

1. WHEN 파티 가입이 시작되면 THE PartyServiceImpl SHALL Toss 결제 호출 전에 정원을 먼저 증가시킨다
2. IF 정원 증가가 실패하면 (이미 만석) THEN THE PartyServiceImpl SHALL Toss 결제를 호출하지 않고 예외를 발생시킨다
3. IF Toss 결제가 실패하면 THEN THE PartyServiceImpl SHALL 정원을 다시 감소시킨다
4. IF Toss 성공 후 DB 저장이 실패하면 THEN THE PartyServiceImpl SHALL 보상 트랜잭션을 등록하고 정원을 감소시킨다

### Requirement 4: 환불 정책 간소화

**User Story:** As a 파티원, I want 명확한 환불 정책을 적용받도록, so that 환불 가능 여부를 쉽게 이해할 수 있다.

#### Acceptance Criteria

1. WHEN 파티 시작 2일 전까지 탈퇴하면 THE DepositService SHALL 보증금을 전액 환불한다
2. WHEN 파티 시작 1일 전부터 탈퇴하면 THE DepositService SHALL 보증금을 전액 몰수한다 (환불 없음)
3. WHEN 환불 정책이 적용될 때 THE DepositService SHALL partialRefundDeposit 메서드를 사용하지 않는다

### Requirement 5: RefundRetryHistory 확장

**User Story:** As a 시스템, I want 환불 재시도와 보상 트랜잭션을 구분하여 처리하도록, so that 각 유형에 맞는 처리 로직을 적용할 수 있다.

#### Acceptance Criteria

1. THE RefundRetryHistory 테이블 SHALL retryType 컬럼을 포함한다 (REFUND 또는 COMPENSATION)
2. WHEN RefundScheduler가 재시도를 처리할 때 THE RefundRetryService SHALL retryType에 따라 분기 처리한다
3. WHEN retryType이 COMPENSATION이면 THE RefundRetryService SHALL Toss 취소만 수행하고 Deposit을 삭제한다
4. WHEN retryType이 REFUND이면 THE RefundRetryService SHALL 기존 환불 재시도 로직을 수행한다

### Requirement 6: DepositStatus PENDING 상태 추가

**User Story:** As a 시스템, I want 결제 진행 중인 보증금을 PENDING 상태로 관리하도록, so that 2단계 저장 패턴을 적용할 수 있다.

#### Acceptance Criteria

1. THE DepositStatus enum SHALL PENDING 상태를 포함한다
2. WHEN 보증금이 PENDING 상태로 24시간 이상 유지되면 THE 정리 스케줄러 SHALL 해당 레코드를 삭제한다
3. WHEN PENDING 상태 Deposit이 삭제될 때 THE 시스템 SHALL 관련 보상 트랜잭션이 처리되었는지 확인한다

### Requirement 7: 프론트엔드 환불 정책 안내 수정

**User Story:** As a 파티원, I want 정확한 환불 정책 안내를 받도록, so that 탈퇴 시 환불 가능 여부를 올바르게 인지할 수 있다.

#### Acceptance Criteria

1. WHEN 파티 탈퇴 모달이 표시될 때 THE LeavePartyWarningModal SHALL 정확한 환불 정책을 안내한다
2. THE 환불 정책 안내 SHALL "파티 시작 2일 전까지 전액 환불, 1일 전부터 환불 불가"를 명시한다

### Requirement 8: 보상 트랜잭션 최종 실패 알림

**User Story:** As a 시스템 관리자, I want 보상 트랜잭션이 4회 모두 실패하면 알림을 받도록, so that 수동 개입이 필요한 건을 인지할 수 있다.

#### Acceptance Criteria

1. WHEN 보상 트랜잭션이 4회 재시도 후에도 실패하면 THE RefundRetryService SHALL 관리자 알림을 발송한다
2. THE 알림 SHALL depositId, 금액, 실패 사유를 포함한다

### Requirement 9: 정산 스케줄러 기간 계산 수정

**User Story:** As a 방장, I want 정산이 완료된 billing cycle에 대해서만 정산되도록, so that 미래 날짜의 결제가 포함되지 않는다.

#### Acceptance Criteria

1. WHEN 정산 스케줄러가 실행될 때 THE SettlementServiceImpl SHALL 이전 완료된 billing cycle만 정산한다
2. IF 파티 시작일이 15일이고 현재가 2월 1일이면 THEN THE 정산 기간 SHALL 12월 15일 ~ 1월 14일이어야 한다
3. WHEN 정산 기간을 계산할 때 THE SettlementServiceImpl SHALL 현재 날짜 이전의 기간만 포함한다
