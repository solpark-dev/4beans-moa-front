# Requirements Document

## Introduction

이 문서는 MOA 플랫폼의 결제 재시도 기능과 파티 생성 시 날짜 자동 계산 기능에 대한 요구사항을 정의합니다. 결제 실패 시 파티장과 파티원이 수동으로 재시도할 수 있는 기능을 추가하고, 파티 생성 시 개월 수 선택만으로 시작일/종료일이 자동 계산되도록 개선합니다.

## Glossary

- **MOA_System**: MOA OTT 구독 공유 플랫폼 시스템
- **Party_Leader**: 파티를 생성하고 관리하는 사용자 (파티장)
- **Party_Member**: 파티에 가입한 일반 사용자 (파티원)
- **Payment**: 보증금 또는 월 구독료 결제
- **Payment_Retry**: 실패한 결제를 다시 시도하는 행위
- **Subscription_Period**: 구독 기간 (개월 단위)

## Requirements

### Requirement 1

**User Story:** As a Party_Leader, I want to retry a failed deposit payment, so that I can complete party creation without starting over.

#### Acceptance Criteria

1. WHEN a Party_Leader views a party with PENDING_PAYMENT status THEN the MOA_System SHALL display a "결제 재시도" button
2. WHEN a Party_Leader clicks the retry payment button THEN the MOA_System SHALL initiate a new payment request with the same amount
3. WHEN the retry payment succeeds THEN the MOA_System SHALL update the party status to RECRUITING and display a success message
4. IF the retry payment fails THEN the MOA_System SHALL display an error message with the failure reason and allow another retry attempt
5. WHILE a payment is being processed THEN the MOA_System SHALL disable the retry button and show a loading indicator

### Requirement 2

**User Story:** As a Party_Member, I want to retry a failed monthly subscription payment, so that I can maintain my party membership.

#### Acceptance Criteria

1. WHEN a Party_Member has a FAILED payment status THEN the MOA_System SHALL display a "결제 재시도" button in the payment history
2. WHEN a Party_Member clicks the retry payment button THEN the MOA_System SHALL initiate a new payment request for the failed amount
3. WHEN the retry payment succeeds THEN the MOA_System SHALL update the payment status to COMPLETED and record the retry history
4. IF the retry payment fails THEN the MOA_System SHALL increment the retry attempt count and display the failure reason
5. WHILE the retry attempt count exceeds 4 THEN the MOA_System SHALL disable manual retry and display a customer support contact message

### Requirement 3

**User Story:** As a Party_Leader, I want to select a start date and subscription duration, so that the system automatically calculates the end date.

#### Acceptance Criteria

1. WHEN a Party_Leader enters a start date THEN the MOA_System SHALL accept dates from today onwards
2. WHEN a Party_Leader selects a subscription period (1-12 months) THEN the MOA_System SHALL display a slider or dropdown for clean selection
3. WHEN both start date and subscription period are selected THEN the MOA_System SHALL calculate the end date by adding the selected months to the start date minus one day
4. WHEN displaying calculated dates THEN the MOA_System SHALL show both start date and end date in YYYY-MM-DD format
5. THE MOA_System SHALL enforce a minimum subscription period of 1 month and maximum of 12 months
6. WHEN start date or subscription period is not selected THEN the MOA_System SHALL disable the "다음" button to prevent proceeding

### Requirement 4

**User Story:** As a user, I want to see my payment retry history, so that I can track failed payment attempts and their outcomes.

#### Acceptance Criteria

1. WHEN viewing payment details with retry history THEN the MOA_System SHALL display the number of retry attempts
2. WHEN viewing payment details with retry history THEN the MOA_System SHALL display the next scheduled retry date if applicable
3. WHEN viewing payment details with retry history THEN the MOA_System SHALL display the failure reason for each attempt
4. WHEN a payment has no retry history THEN the MOA_System SHALL not display the retry information section

### Requirement 5

**User Story:** As a system administrator, I want pending payments to be automatically cancelled after a timeout period, so that incomplete transactions do not clutter the system.

#### Acceptance Criteria

1. WHEN a party remains in PENDING_PAYMENT status for more than 30 minutes THEN the MOA_System SHALL automatically cancel the party and release resources
2. WHEN a party is auto-cancelled due to payment timeout THEN the MOA_System SHALL update the party status to CANCELLED
3. WHEN a scheduled payment timeout check runs THEN the MOA_System SHALL process all expired pending payments
4. WHEN a party is cancelled due to timeout THEN the MOA_System SHALL log the cancellation reason for audit purposes
5. THE MOA_System SHALL run the payment timeout check every 5 minutes via a scheduled task
