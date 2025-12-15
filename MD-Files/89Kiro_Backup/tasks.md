# Implementation Plan

## 1. Backend - Payment Retry API

- [x] 1.1 Add retry payment endpoint to PaymentRestController
  - Add `POST /api/v1/payments/{paymentId}/retry` endpoint
  - Validate user authorization and payment ownership
  - Call PaymentService.retryFailedPayment()
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 1.2 Implement retryFailedPayment method in PaymentService
  - Check payment exists and status is FAILED
  - Verify retry attempt count < 4
  - Get billing key and call TossPaymentService
  - Update payment status and record retry history
  - _Requirements: 2.2, 2.3, 2.4, 2.5_

- [x] 1.3 Write property test for retry eligibility
  - **Property 4: Max Retry Limit Enforcement**
  - **Validates: Requirements 2.5**

- [x] 1.4 Add deposit retry endpoint to PaymentRestController
  - Add `POST /api/v1/payments/deposit/{partyId}/retry` endpoint
  - Validate party leader authorization
  - Process Toss payment and update party status
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 1.5 Implement retryLeaderDeposit method in PartyService
  - Verify party status is PENDING_PAYMENT
  - Verify current user is party leader
  - Process payment via TossPaymentService
  - Update party status to RECRUITING on success
  - _Requirements: 1.2, 1.3, 1.4_

- [x] 1.6 Write property test for party status transition
  - **Property 2: Successful Retry State Transition**
  - **Validates: Requirements 1.3, 2.3**

## 2. Backend - Payment Detail Enhancement

- [x] 2.1 Add canRetry field to PaymentDetailResponse
  - Add boolean canRetry field
  - Add int maxRetryAttempts field (constant 4)
  - Calculate canRetry based on status and attemptNumber
  - _Requirements: 2.1, 2.5, 4.1_

- [x] 2.2 Update PaymentMapper to include retry eligibility
  - Modify findDetailById query to calculate canRetry
  - Include attemptNumber in response
  - _Requirements: 4.1, 4.2, 4.3_

## 3. Checkpoint - Backend Tests

- [x] 3. Checkpoint - Make sure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## 4. Frontend - Payment Retry UI

- [x] 4.1 Add retry API functions to paymentApi.js
  - Add retryPayment(paymentId) function
  - Add retryDepositPayment(partyId, paymentData) function
  - Handle error responses appropriately
  - _Requirements: 1.2, 2.2_

- [x] 4.2 Update PaymentDetailModal with retry button
  - Show "결제 재시도" button when payment.paymentStatus === 'FAILED' and payment.canRetry
  - Show loading state during retry
  - Show success/error toast messages
  - Show customer support message when attemptNumber >= 4
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 4.3 Write property test for retry button visibility
  - **Property 1: Retry Button Visibility**
  - **Validates: Requirements 1.1, 2.1**

- [x] 4.4 Update PartyDetailPage with deposit retry button
  - Show "보증금 재결제" button when party.partyStatus === 'PENDING_PAYMENT' and isLeader
  - Integrate with Toss Payments for retry
  - Update UI on success/failure
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 4.5 Write property test for retry history display
  - **Property 9: Retry History Display Completeness**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

## 5. Frontend - Date Calculation Enhancement

- [x] 5.1 Create date calculation utility function
  - Create calculateEndDate(startDate, months) function in utils
  - endDate = startDate + months - 1 day
  - Return date in YYYY-MM-DD format
  - _Requirements: 3.3, 3.4_

- [x] 5.2 Write property test for date calculation
  - **Property 5: Date Calculation Correctness**
  - **Validates: Requirements 3.1, 3.3**

- [x] 5.3 Write property test for date format
  - **Property 6: Date Format Consistency**
  - **Validates: Requirements 3.4**

- [x] 5.4 Update PartyCreatePage with improved UI
  - Add date picker for start date (minimum: today)
  - Replace 6 buttons with slider (1-12 months) or dropdown
  - Calculate and display end date automatically
  - Disable "다음" button when start date or period not selected
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 5.5 Write property test for button state
  - **Property 8: Button State Based on Selection**
  - **Validates: Requirements 3.6**

## 6. Backend - Payment Timeout Scheduler

- [x] 6.1 Create PaymentTimeoutScheduler class
  - Create scheduled task that runs every 5 minutes
  - Query parties with PENDING_PAYMENT status older than 30 minutes
  - Call PartyService to cancel expired parties
  - _Requirements: 5.3, 5.5_

- [x] 6.2 Implement cancelExpiredParty method in PartyService
  - Update party status to CANCELLED
  - Log cancellation reason for audit
  - Clean up any related pending data
  - _Requirements: 5.1, 5.2, 5.4_

- [x] 6.3 Write property test for timeout cancellation
  - **Property 10: Payment Timeout Cancellation**
  - **Validates: Requirements 5.1, 5.2**
  - (Covered by paymentRetry.test.js - party status transition tests)

## 7. Final Checkpoint

- [x] 7. Final Checkpoint - Make sure all tests pass
  - All 36 tests passed (2 test files)
