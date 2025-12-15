# Design Document

## Overview

MOA 서비스의 자동 정산 시스템을 위한 Mock 오픈뱅킹 API 설계 문서이다. 금융결제원 오픈뱅킹 API 스펙을 따르는 Mock 서버를 구축하고, 파티장 계좌 등록(1원 인증) 및 자동 정산 기능을 구현한다.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           MOA Frontend                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │ 계좌등록 UI  │  │ 정산내역 UI  │  │ 계좌관리 UI  │               │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘               │
└─────────┼─────────────────┼─────────────────┼───────────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           MOA Backend                                │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    BankAccountController                      │   │
│  │  - POST /api/bank-account/verify-request (1원 인증 요청)      │   │
│  │  - POST /api/bank-account/verify (인증코드 검증)              │   │
│  │  - GET /api/bank-account (계좌 조회)                          │   │
│  │  - DELETE /api/bank-account (계좌 삭제)                       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    SettlementController                       │   │
│  │  - GET /api/settlements (정산 내역 조회)                      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                   OpenBankingClient                           │   │
│  │  - requestVerification() : 1원 인증 요청                      │   │
│  │  - verifyCode() : 인증코드 검증                               │   │
│  │  - transferDeposit() : 입금이체                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │ HTTP 호출                             │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              MockOpenBankingController (Mock 서버)            │   │
│  │  - POST /mock/openbanking/inquiry/receive (1원 인증)          │   │
│  │  - POST /mock/openbanking/inquiry/verify (인증 검증)          │   │
│  │  - POST /mock/openbanking/transfer/deposit (입금이체)         │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                  SettlementScheduler                          │   │
│  │  - @Scheduled(cron = "0 0 10 * * *") 매일 오전 10시           │   │
│  │  - 정산 대기 건 조회 → OpenBankingClient로 이체 요청          │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. MockOpenBankingController

오픈뱅킹 API 스펙을 따르는 Mock REST API 서버

```java
@RestController
@RequestMapping("/mock/openbanking")
public class MockOpenBankingController {
    
    // 1원 인증 요청 (수취조회)
    @PostMapping("/inquiry/receive")
    public InquiryReceiveResponse inquiryReceive(@RequestBody InquiryReceiveRequest request);
    
    // 인증코드 검증
    @PostMapping("/inquiry/verify")
    public InquiryVerifyResponse verifyCode(@RequestBody InquiryVerifyRequest request);
    
    // 입금이체
    @PostMapping("/transfer/deposit")
    public TransferDepositResponse transferDeposit(@RequestBody TransferDepositRequest request);
}
```

### 2. OpenBankingClient

Mock 서버 또는 실제 오픈뱅킹 API를 호출하는 클라이언트

```java
public interface OpenBankingClient {
    InquiryReceiveResponse requestVerification(String bankCode, String accountNum, String holderName);
    InquiryVerifyResponse verifyCode(String bankTranId, String verifyCode);
    TransferDepositResponse transferDeposit(String fintechUseNum, int amount, String printContent);
}

@Service
@Profile("dev")
public class MockOpenBankingClient implements OpenBankingClient {
    // WebClient로 Mock 서버 호출
}

@Service
@Profile("prod")
public class RealOpenBankingClient implements OpenBankingClient {
    // 실제 오픈뱅킹 API 호출 (나중에 구현)
}
```

### 3. BankAccountService

파티장 계좌 등록 및 관리 서비스

```java
public interface BankAccountService {
    // 1원 인증 요청
    VerificationRequestResult requestVerification(Long userId, BankAccountRequest request);
    
    // 인증코드 검증 및 계좌 등록
    BankAccount verifyAndRegister(Long userId, String bankTranId, String verifyCode);
    
    // 계좌 조회
    BankAccount getAccount(Long userId);
    
    // 계좌 삭제
    void deleteAccount(Long userId);
}
```

### 4. SettlementScheduler

자동 정산 처리 스케줄러

```java
@Component
public class SettlementScheduler {
    
    @Scheduled(cron = "0 0 10 * * *") // 매일 오전 10시
    public void processSettlements() {
        // 1. 정산 대기 건 조회
        // 2. 각 건에 대해 입금이체 요청
        // 3. 결과에 따라 상태 업데이트
    }
}
```

## Data Models

### 1. bank_account 테이블

```sql
CREATE TABLE bank_account (
    bank_account_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    bank_code VARCHAR(3) NOT NULL,           -- 은행코드 (예: 004)
    bank_name VARCHAR(20) NOT NULL,          -- 은행명 (예: KB국민은행)
    account_num VARCHAR(20) NOT NULL,        -- 계좌번호
    account_holder VARCHAR(50) NOT NULL,     -- 예금주명
    fintech_use_num VARCHAR(30),             -- 핀테크이용번호
    status VARCHAR(20) DEFAULT 'ACTIVE',     -- ACTIVE, INACTIVE
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);
```

### 2. account_verification 테이블

```sql
CREATE TABLE account_verification (
    verification_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    bank_tran_id VARCHAR(30) NOT NULL,       -- 거래고유번호
    bank_code VARCHAR(3) NOT NULL,
    account_num VARCHAR(20) NOT NULL,
    verify_code VARCHAR(4) NOT NULL,         -- 4자리 인증코드
    attempt_count INT DEFAULT 0,             -- 인증 시도 횟수
    status VARCHAR(20) DEFAULT 'PENDING',    -- PENDING, VERIFIED, EXPIRED, FAILED
    expired_at TIMESTAMP NOT NULL,           -- 만료시간 (5분 후)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);
```

### 3. transfer_transaction 테이블

```sql
CREATE TABLE transfer_transaction (
    transaction_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    settlement_id BIGINT NOT NULL,
    bank_tran_id VARCHAR(30) NOT NULL,       -- 거래고유번호
    fintech_use_num VARCHAR(30) NOT NULL,
    tran_amt INT NOT NULL,                   -- 이체금액
    print_content VARCHAR(20),               -- 입금통장 인자내역
    rsp_code VARCHAR(10),                    -- 응답코드
    rsp_message VARCHAR(100),                -- 응답메시지
    status VARCHAR(20) DEFAULT 'PENDING',    -- PENDING, SUCCESS, FAILED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (settlement_id) REFERENCES settlement(settlement_id)
);
```

### 4. API Request/Response DTOs

```java
// 1원 인증 요청
@Data
public class InquiryReceiveRequest {
    private String bankCodeStd;      // 은행코드
    private String accountNum;       // 계좌번호
    private String accountHolderInfo; // 예금주명
    private String tranAmt = "1";    // 이체금액 (1원)
    private String printContent;     // 입금통장 인자내역 (인증코드)
}

@Data
public class InquiryReceiveResponse {
    private String rspCode;          // 응답코드 (A0000: 성공)
    private String rspMessage;       // 응답메시지
    private String bankTranId;       // 거래고유번호
    private String printContent;     // 인증코드
}

// 인증 검증
@Data
public class InquiryVerifyRequest {
    private String bankTranId;       // 거래고유번호
    private String verifyCode;       // 사용자 입력 인증코드
}

@Data
public class InquiryVerifyResponse {
    private String rspCode;
    private String rspMessage;
    private boolean verified;
    private String fintechUseNum;    // 핀테크이용번호 (인증 성공 시)
}

// 입금이체
@Data
public class TransferDepositRequest {
    private String fintechUseNum;    // 핀테크이용번호
    private String tranAmt;          // 이체금액
    private String printContent;     // 입금통장 인자내역
    private String reqClientName;    // 요청고객성명
}

@Data
public class TransferDepositResponse {
    private String rspCode;
    private String rspMessage;
    private String bankTranId;       // 거래고유번호
    private String tranAmt;          // 이체금액
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: 인증코드 생성 일관성
*For any* 유효한 은행코드, 계좌번호, 예금주명 조합에 대해, 1원 인증 요청 시 항상 4자리 숫자 인증코드가 생성되어야 한다.
**Validates: Requirements 1.1**

### Property 2: 인증코드 검증 정확성
*For any* 인증 세션에 대해, 올바른 인증코드 입력 시 항상 인증 성공 및 fintech_use_num이 발급되고, 틀린 인증코드 입력 시 항상 인증 실패가 반환되어야 한다.
**Validates: Requirements 1.3, 2.2**

### Property 3: 계좌 등록 상태 일관성
*For any* 인증 성공 후, 해당 사용자의 bank_account 테이블에 계좌 정보가 저장되고 status가 ACTIVE여야 한다.
**Validates: Requirements 1.4**

### Property 4: API 응답 형식 준수
*For any* Mock 오픈뱅킹 API 호출에 대해, 응답은 항상 rspCode, rspMessage 필드를 포함하고 오픈뱅킹 표준 형식을 따라야 한다.
**Validates: Requirements 2.1**

### Property 5: 필수 파라미터 검증
*For any* API 요청에서 필수 파라미터가 누락된 경우, 항상 에러 응답코드와 적절한 에러 메시지가 반환되어야 한다.
**Validates: Requirements 2.4**

### Property 6: 입금이체 거래 기록
*For any* 유효한 입금이체 요청에 대해, transfer_transaction 테이블에 거래가 기록되고 성공 응답이 반환되어야 한다.
**Validates: Requirements 2.3**

### Property 7: 정산 성공 시 상태 변경
*For any* 입금이체 성공 응답을 받은 정산 건에 대해, settlement 상태가 COMPLETED로 변경되고 bank_tran_id가 기록되어야 한다.
**Validates: Requirements 3.3**

### Property 8: 정산 실패 시 상태 변경
*For any* 입금이체 실패 응답을 받은 정산 건에 대해, settlement 상태가 FAILED로 변경되고 실패 사유가 기록되어야 한다.
**Validates: Requirements 3.4**

### Property 9: 정산 내역 정렬
*For any* 파티장의 정산 내역 조회 시, 결과는 항상 정산일 기준 내림차순(최신순)으로 정렬되어야 한다.
**Validates: Requirements 4.1**

### Property 10: 정산 내역 필수 필드
*For any* 정산 내역 응답에 대해, 각 항목은 정산일, 파티명, 금액, 상태 필드를 포함해야 한다.
**Validates: Requirements 4.2**

### Property 11: 실패 정산 사유 포함
*For any* 상태가 FAILED인 정산 내역에 대해, 실패 사유(fail_reason) 필드가 null이 아니어야 한다.
**Validates: Requirements 4.3**

### Property 12: 기간 필터링 정확성
*For any* 기간 필터가 적용된 정산 내역 조회에 대해, 모든 결과의 정산일이 지정된 기간 내에 있어야 한다.
**Validates: Requirements 4.4**

### Property 13: 계좌번호 마스킹
*For any* 계좌 정보 조회 시, 계좌번호는 앞 4자리와 뒤 4자리만 표시하고 나머지는 마스킹(*)되어야 한다.
**Validates: Requirements 5.1**

### Property 14: 계좌 교체 원자성
*For any* 새 계좌 인증 완료 시, 기존 계좌는 INACTIVE 상태로, 새 계좌는 ACTIVE 상태로 동시에 변경되어야 한다.
**Validates: Requirements 5.3**

### Property 15: 계좌 삭제 상태 변경
*For any* 계좌 삭제 요청 시, 해당 계좌의 status가 INACTIVE로 변경되어야 한다.
**Validates: Requirements 5.4**

## Error Handling

### 오픈뱅킹 표준 에러코드

| 에러코드 | 설명 | HTTP Status |
|---------|------|-------------|
| A0000 | 성공 | 200 |
| A0001 | 필수 파라미터 누락 | 400 |
| A0002 | 잘못된 파라미터 형식 | 400 |
| A0003 | 인증코드 불일치 | 400 |
| A0004 | 인증 세션 만료 | 400 |
| A0005 | 인증 시도 횟수 초과 | 400 |
| A0006 | 계좌 미등록 | 404 |
| A0007 | 이체 실패 | 500 |

### 에러 응답 형식

```json
{
  "rspCode": "A0001",
  "rspMessage": "필수 파라미터가 누락되었습니다: bankCodeStd"
}
```

## Testing Strategy

### Unit Testing

- BankAccountService: 계좌 등록, 인증, 삭제 로직 테스트
- SettlementScheduler: 정산 처리 로직 테스트 (Mock OpenBankingClient 사용)
- MockOpenBankingController: API 요청/응답 형식 테스트

### Property-Based Testing

Property-based testing을 위해 **jqwik** 라이브러리를 사용한다.

```xml
<dependency>
    <groupId>net.jqwik</groupId>
    <artifactId>jqwik</artifactId>
    <version>1.8.2</version>
    <scope>test</scope>
</dependency>
```

각 property-based test는 다음 형식의 주석을 포함해야 한다:
```java
// **Feature: mock-openbanking-settlement, Property 1: 인증코드 생성 일관성**
```

Property-based test는 최소 100회 반복 실행하도록 설정한다.

### Integration Testing

- 1원 인증 전체 플로우 테스트 (요청 → 검증 → 계좌 등록)
- 정산 스케줄러 전체 플로우 테스트 (조회 → 이체 → 상태 변경)
