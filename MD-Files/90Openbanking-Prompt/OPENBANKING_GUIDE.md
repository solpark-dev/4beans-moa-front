# 오픈뱅킹 API 구현 가이드

> 작성일: 2025-12-12
> 대상: 초보 개발자
> 목적: 현재 Mock 구현 분석 및 실제 API 연동 가이드

---

## 목차

1. [오픈뱅킹이란?](#1-오픈뱅킹이란)
2. [현재 프로젝트 구조](#2-현재-프로젝트-구조)
3. [1원 인증이란?](#3-1원-인증이란)
4. [현재 코드 분석](#4-현재-코드-분석)
5. [로직 검증 결과](#5-로직-검증-결과)
6. [실제 API 연동 시 변경사항](#6-실제-api-연동-시-변경사항)
7. [전체 플로우 다이어그램](#7-전체-플로우-다이어그램)

---

## 1. 오픈뱅킹이란?

### 1.1 기본 개념

**오픈뱅킹(Open Banking)**은 금융결제원에서 제공하는 API 서비스입니다.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   우리 앱    │ ──→ │  금융결제원   │ ──→ │   각 은행    │
│  (4beans)   │ ←── │ (오픈뱅킹)   │ ←── │ (국민,신한등) │
└─────────────┘     └─────────────┘     └─────────────┘
```

**쉽게 설명하면:**
- 예전: 각 은행마다 다른 API를 사용해야 함 (국민은행 API, 신한은행 API...)
- 지금: 금융결제원의 오픈뱅킹 API 하나로 모든 은행 계좌 연결 가능

### 1.2 오픈뱅킹으로 할 수 있는 것

| 기능 | 설명 | 우리 서비스 사용 여부 |
|------|------|---------------------|
| 잔액 조회 | 사용자 계좌 잔액 확인 | X |
| 거래내역 조회 | 입출금 내역 확인 | X |
| 이체 | 다른 계좌로 돈 보내기 | O (정산) |
| 출금 | 사용자 계좌에서 돈 빼기 | X |
| 수취 조회 | 받는 사람 실명 확인 | O (1원 인증) |

### 1.3 왜 오픈뱅킹을 사용하나요?

우리 서비스(4beans-moa)에서는:
1. **파티장에게 정산금 지급** - 매월 파티장에게 수익 이체
2. **계좌 본인 확인** - 1원 인증으로 본인 계좌인지 확인

---

## 2. 현재 프로젝트 구조

### 2.1 관련 파일 목록

```
src/
├── api/
│   └── bankAccountApi.js      ⭐ 핵심: 계좌 관련 API 호출
│
├── pages/
│   ├── account/
│   │   └── BankAccountPage.jsx    ⭐ 주요 사용: 계좌 관리 페이지
│   └── user/
│       ├── register/
│       │   └── AccountRegisterPage.jsx  ⚠️ 미완성: 오픈뱅킹 연동 페이지
│       └── MyWalletPage.jsx       지갑 메인 페이지
│
└── store/
    └── wallet/
        └── walletStore.js         계좌/카드 상태 관리
```

### 2.2 현재 상태 요약

| 파일 | 상태 | 설명 |
|------|------|------|
| `bankAccountApi.js` | ✅ 완성 | Mock API 호출 로직 완성 |
| `BankAccountPage.jsx` | ✅ 완성 | 1원 인증 UI 완성 |
| `AccountRegisterPage.jsx` | ⚠️ 미완성 | 실제 오픈뱅킹 연동 코드 주석 처리됨 |

---

## 3. 1원 인증이란?

### 3.1 개념

**1원 인증**은 계좌 소유자를 확인하는 방법입니다.

```
[사용자]                    [서버]                     [은행]
   │                         │                         │
   │ 1. 계좌번호 입력         │                         │
   │ ──────────────────────→ │                         │
   │                         │ 2. 1원 이체 요청         │
   │                         │ ──────────────────────→ │
   │                         │                         │
   │                         │ 3. 1원 입금 (입금자명에 코드 포함) │
   │                         │ ←────────────────────── │
   │                         │                         │
   │ 4. 입금자명 확인 (예: MOA1234)                      │
   │                         │                         │
   │ 5. 코드 입력 (1234)      │                         │
   │ ──────────────────────→ │                         │
   │                         │ 6. 코드 검증             │
   │                         │                         │
   │ 7. 인증 완료!            │                         │
   │ ←────────────────────── │                         │
```

### 3.2 왜 1원을 보내나요?

1. **본인 확인**: 입금자명에 포함된 코드를 알 수 있는 사람 = 계좌 소유자
2. **소액 인증**: 1원은 부담 없는 금액
3. **빠른 확인**: 실시간 입금 확인 가능

### 3.3 입금자명 예시

```
입금자명: MOA1234
         ↑   ↑
      서비스명  인증코드(4자리)
```

사용자는 은행 앱에서 "MOA1234"가 입금된 것을 확인하고, "1234"를 입력합니다.

---

## 4. 현재 코드 분석

### 4.1 bankAccountApi.js - API 호출 함수

```javascript
// 📁 src/api/bankAccountApi.js

import httpClient from "./httpClient";

/**
 * 🔹 1원 인증 요청
 *
 * 역할: 사용자가 입력한 계좌로 1원을 보내달라고 서버에 요청
 *
 * @param {string} bankCode - 은행코드 (예: "088" = 신한은행)
 * @param {string} accountNum - 계좌번호 (예: "110123456789")
 * @param {string} accountHolder - 예금주명 (예: "홍길동")
 */
export const requestVerification = async (bankCode, accountNum, accountHolder) => {
    try {
        // 서버에 POST 요청
        const apiResponse = await httpClient.post("/bank-account/verify-request", {
            bankCode,
            accountNum,
            accountHolder
        });
        return apiResponse.data || apiResponse;
    } catch (error) {
        console.error("Failed to request verification:", error);
        throw error;
    }
};

/**
 * 🔹 인증코드 검증 및 계좌 등록
 *
 * 역할: 사용자가 입력한 4자리 코드가 맞는지 확인하고, 맞으면 계좌 등록
 *
 * @param {string} bankTranId - 거래고유번호 (1원 인증 요청 시 받은 ID)
 * @param {string} verifyCode - 사용자가 입력한 4자리 인증코드
 */
export const verifyAndRegister = async (bankTranId, verifyCode) => {
    try {
        const apiResponse = await httpClient.post("/bank-account/verify", {
            bankTranId,
            verifyCode
        });
        return apiResponse.data || apiResponse;
    } catch (error) {
        console.error("Failed to verify code:", error);
        throw error;
    }
};

/**
 * 🔹 계좌 정보 조회
 *
 * 역할: 현재 등록된 계좌 정보 가져오기
 */
export const getAccount = async () => {
    try {
        const apiResponse = await httpClient.get("/bank-account");
        return apiResponse.data || apiResponse;
    } catch (error) {
        console.error("Failed to fetch account:", error);
        throw error;
    }
};

/**
 * 🔹 계좌 삭제
 *
 * 역할: 등록된 계좌 삭제
 */
export const deleteAccount = async () => { ... };

/**
 * 🔹 계좌 변경
 *
 * 역할: 기존 계좌를 다른 계좌로 변경 (새로 1원 인증 필요)
 */
export const changeAccount = async (bankCode, accountNum, accountHolder) => { ... };

// 🔹 은행 코드 목록 (상수)
export const BANK_CODES = [
    { code: "004", name: "KB국민은행" },
    { code: "011", name: "NH농협은행" },
    { code: "020", name: "우리은행" },
    { code: "023", name: "SC제일은행" },
    { code: "081", name: "하나은행" },
    { code: "088", name: "신한은행" },
    { code: "089", name: "케이뱅크" },
    { code: "090", name: "카카오뱅크" },
    { code: "092", name: "토스뱅크" }
];
```

### 4.2 BankAccountPage.jsx - UI 페이지

```javascript
// 📁 src/pages/account/BankAccountPage.jsx

export default function BankAccountPage() {
    // ==================== 상태(State) 정의 ====================

    // 현재 화면 단계 (view: 조회, input: 입력, verify: 인증)
    const [step, setStep] = useState('view');

    // 사용자가 입력하는 값들
    const [bankCode, setBankCode] = useState('');       // 선택한 은행
    const [accountNum, setAccountNum] = useState('');   // 계좌번호
    const [accountHolder, setAccountHolder] = useState(''); // 예금주명

    // 인증 관련
    const [bankTranId, setBankTranId] = useState('');   // 거래ID (서버에서 받음)
    const [verifyCode, setVerifyCode] = useState('');   // 사용자가 입력할 인증코드
    const [verifyCodeFromServer, setVerifyCodeFromServer] = useState(''); // 개발용 (실제 코드 표시)

    // ==================== 1원 인증 요청 ====================

    const handleRequestVerification = async (e) => {
        e.preventDefault();

        try {
            // 📤 서버에 1원 인증 요청
            const response = await requestVerification(bankCode, accountNum, accountHolder);

            // 📥 서버 응답에서 필요한 정보 저장
            setBankTranId(response.bankTranId);  // 다음 단계에서 필요한 거래 ID

            // ⚠️ 개발 모드에서만: 인증코드를 화면에 표시
            setVerifyCodeFromServer(response.printContent);

            // 다음 단계로 이동
            setStep('verify');
            setSuccess('인증코드가 발송되었습니다. (개발모드: ' + response.printContent + ')');

        } catch (err) {
            setError(err.response?.data?.message || '인증 요청에 실패했습니다.');
        }
    };

    // ==================== 인증코드 검증 ====================

    const handleVerify = async (e) => {
        e.preventDefault();

        try {
            // 📤 인증코드 검증 요청
            await verifyAndRegister(bankTranId, verifyCode);

            // 성공! 계좌 등록 완료
            setSuccess('계좌가 등록되었습니다!');
            await fetchAccount();  // 등록된 계좌 정보 다시 불러오기
            setStep('view');       // 조회 화면으로 이동

        } catch (err) {
            setError(err.response?.data?.message || '인증에 실패했습니다.');
        }
    };

    // ==================== UI 렌더링 ====================

    return (
        <div>
            {/* step === 'view': 등록된 계좌 표시 */}
            {/* step === 'input': 계좌 입력 폼 */}
            {/* step === 'verify': 인증코드 입력 폼 */}
        </div>
    );
}
```

### 4.3 화면 흐름 (Step by Step)

```
┌─────────────────────────────────────────────────────────────┐
│                    STEP 1: VIEW (조회)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  등록된 계좌                                          │   │
│  │  신한은행                                             │   │
│  │  110-***-******                                      │   │
│  │  홍길동                                               │   │
│  │                                                      │   │
│  │  [계좌 변경]  [삭제]                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  * 계좌가 없으면 자동으로 STEP 2로 이동                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ "계좌 변경" 클릭
┌─────────────────────────────────────────────────────────────┐
│                    STEP 2: INPUT (입력)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  은행 선택: [신한은행      ▼]                          │   │
│  │                                                      │   │
│  │  계좌번호: [110123456789    ]                         │   │
│  │                                                      │   │
│  │  예금주명: [홍길동          ]                          │   │
│  │                                                      │   │
│  │  [1원 인증 요청]                                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ "1원 인증 요청" 클릭
┌─────────────────────────────────────────────────────────────┐
│                    STEP 3: VERIFY (인증)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  입력하신 계좌로 1원이 입금되었습니다.                    │   │
│  │  입금자명에 표시된 4자리 인증코드를 입력해주세요.          │   │
│  │                                                      │   │
│  │  [개발모드] 인증코드: 1234                             │   │
│  │                                                      │   │
│  │  인증코드 (4자리): [1234]                              │   │
│  │                                                      │   │
│  │  [이전]  [인증 완료]                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ "인증 완료" 클릭
┌─────────────────────────────────────────────────────────────┐
│                    완료! STEP 1로 돌아감                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. 로직 검증 결과

### 5.1 현재 구현의 장점 ✅

| 항목 | 평가 | 설명 |
|------|------|------|
| 3단계 플로우 | ✅ 적절 | view → input → verify 자연스러운 흐름 |
| 에러 처리 | ✅ 적절 | try-catch로 에러 처리, 사용자에게 메시지 표시 |
| 로딩 상태 | ✅ 적절 | submitting 상태로 버튼 비활성화 |
| 입력 검증 | ✅ 적절 | 숫자만 입력 가능, 필수 입력 체크 |
| 개발 편의 | ✅ 좋음 | 개발 모드에서 인증코드 표시 |

### 5.2 개선이 필요한 부분 ⚠️

#### 문제 1: 두 개의 페이지가 존재

```
BankAccountPage.jsx      ← 완성된 페이지 (1원 인증 방식)
AccountRegisterPage.jsx  ← 미완성 페이지 (오픈뱅킹 직접 연동 방식)
```

**문제점:**
- 두 페이지가 서로 다른 API 엔드포인트를 사용
- `BankAccountPage`: `/bank-account/...` 사용
- `AccountRegisterPage`: `/openbanking/...` 사용 (존재하지 않는 API)

**권장 해결책:**
- `BankAccountPage.jsx`를 메인으로 사용
- `AccountRegisterPage.jsx`는 삭제하거나, `BankAccountPage`로 리다이렉트

#### 문제 2: AccountRegisterPage의 미완성 코드

```javascript
// AccountRegisterPage.jsx (라인 57-80)

const startAuth = async () => {
    // 오픈뱅킹 API 추후 개발 예정
    alert("오픈뱅킹 계좌 연결 기능은 추후 개발 예정입니다.");

    /*
    // 실제 오픈뱅킹 연동 시 사용할 코드 (주석 처리됨)
    const response = await httpClient.get("/openbanking/auth-url");
    window.location.href = authUrl;
    */
};
```

**현재 상태:**
- 버튼 클릭 시 alert만 표시
- 실제 기능은 주석 처리됨

#### 문제 3: API 엔드포인트 불일치

| 페이지 | 사용하는 API | 존재 여부 |
|--------|-------------|----------|
| BankAccountPage | `/bank-account/verify-request` | ✅ (백엔드에 있어야 함) |
| BankAccountPage | `/bank-account/verify` | ✅ (백엔드에 있어야 함) |
| AccountRegisterPage | `/openbanking/auth-url` | ❌ 없음 |
| AccountRegisterPage | `/openbanking/send-verification` | ❌ 없음 |
| AccountRegisterPage | `/openbanking/verify` | ❌ 없음 |

### 5.3 Mock 데이터 처리 방식 분석

현재 백엔드에서 Mock 처리하는 것으로 보입니다:

```javascript
// BankAccountPage.jsx 라인 66-70

const response = await requestVerification(bankCode, accountNum, accountHolder);
setBankTranId(response.bankTranId);           // 백엔드가 생성한 가짜 거래 ID
setVerifyCodeFromServer(response.printContent); // 백엔드가 생성한 가짜 인증코드
```

**Mock 응답 예시 (백엔드에서 반환):**
```json
{
    "bankTranId": "MOCK-12345678",
    "printContent": "1234"
}
```

**이 방식의 장점:**
- 프론트엔드는 실제 API와 동일한 방식으로 작동
- 백엔드만 수정하면 실제 API로 전환 가능

---

## 6. 실제 API 연동 시 변경사항

### 6.1 프론트엔드 변경사항

**좋은 소식: 프론트엔드는 거의 변경이 필요 없습니다!**

현재 `BankAccountPage.jsx`의 로직은 실제 API에도 그대로 사용 가능합니다.

변경해야 할 것:
```javascript
// 라인 70: 개발 모드 표시 제거
setSuccess('인증코드가 발송되었습니다. (개발모드: ' + response.printContent + ')');
// ↓ 변경
setSuccess('인증코드가 발송되었습니다. 입금내역을 확인해주세요.');

// 라인 233-238: 개발 모드 UI 제거
{verifyCodeFromServer && (
    <Alert className="border-blue-500">
        <AlertDescription>
            [개발모드] 인증코드: <strong>{verifyCodeFromServer}</strong>
        </AlertDescription>
    </Alert>
)}
// ↓ 삭제 또는 조건 추가
{import.meta.env.DEV && verifyCodeFromServer && (
    // 개발 환경에서만 표시
)}
```

### 6.2 백엔드 변경사항 (핵심)

백엔드에서 실제 오픈뱅킹 API를 호출해야 합니다.

#### Step 1: 오픈뱅킹 가입 및 인증키 발급

```
1. 금융결제원 오픈뱅킹 개발자 사이트 가입
   https://developers.openbanking.or.kr

2. 테스트 환경(Sandbox) 신청

3. 인증키 발급
   - client_id
   - client_secret
   - redirect_uri 등록
```

#### Step 2: 백엔드 API 흐름

```
[현재 Mock 방식]
┌──────────┐      ┌──────────┐
│ Frontend │ ──→  │ Backend  │ ──→ Mock 데이터 반환
└──────────┘      └──────────┘

[실제 API 방식]
┌──────────┐      ┌──────────┐      ┌──────────────┐      ┌──────┐
│ Frontend │ ──→  │ Backend  │ ──→  │ 금융결제원    │ ──→  │ 은행  │
└──────────┘      └──────────┘      │ (오픈뱅킹)   │      └──────┘
                                    └──────────────┘
```

#### Step 3: 백엔드 코드 예시 (Java/Spring)

```java
// 1원 인증 요청 (현재 Mock → 실제 API)
@PostMapping("/bank-account/verify-request")
public ApiResponse<VerificationResponse> requestVerification(
    @RequestBody VerificationRequest request
) {
    // ============ 현재 Mock 코드 ============
    // return new VerificationResponse("MOCK-123", "1234");

    // ============ 실제 API 코드 ============
    // 1. 오픈뱅킹 토큰 발급/갱신
    String accessToken = openBankingService.getAccessToken();

    // 2. 수취조회 API 호출 (실명 확인)
    InquiryResponse inquiry = openBankingService.inquiryReceive(
        accessToken,
        request.getBankCode(),
        request.getAccountNum()
    );

    // 3. 예금주명 확인
    if (!inquiry.getAccountHolderName().equals(request.getAccountHolder())) {
        throw new BusinessException("예금주명이 일치하지 않습니다.");
    }

    // 4. 1원 이체 API 호출
    String verifyCode = generateRandomCode(); // 4자리 랜덤 코드
    TransferResponse transfer = openBankingService.transfer(
        accessToken,
        request.getBankCode(),
        request.getAccountNum(),
        1,  // 1원
        "MOA" + verifyCode  // 입금자명에 코드 포함
    );

    // 5. 거래 정보 저장 (DB)
    BankVerification verification = new BankVerification();
    verification.setBankTranId(transfer.getBankTranId());
    verification.setVerifyCode(verifyCode);
    verification.setExpireAt(LocalDateTime.now().plusMinutes(10));
    verificationRepository.save(verification);

    // 6. 응답 (프론트엔드에는 코드를 보내지 않음!)
    return ApiResponse.success(new VerificationResponse(
        transfer.getBankTranId(),
        null  // printContent는 null (보안)
    ));
}
```

### 6.3 실제 vs Mock 비교표

| 항목 | Mock (현재) | 실제 API |
|------|------------|----------|
| 인증코드 생성 | 백엔드에서 랜덤 생성 | 백엔드에서 랜덤 생성 |
| 1원 실제 입금 | ❌ 안 함 | ✅ 실제 입금됨 |
| 프론트에 코드 전달 | ✅ 전달 (개발 편의) | ❌ 전달 안 함 (보안) |
| 입금자명 | - | "MOA1234" 형태 |
| 검증 방식 | DB에 저장된 코드와 비교 | 동일 |

### 6.4 비용 고려사항

실제 오픈뱅킹 API 사용 시:

| 항목 | 비용 |
|------|------|
| API 호출 | 건당 수십 원 |
| 1원 이체 | 1원 + 수수료 (약 10원) |
| 월 기본료 | 서비스에 따라 다름 |

**절약 팁:**
- 인증 시도 횟수 제한 (예: 1일 3회)
- 인증 유효 시간 설정 (예: 10분)
- 이미 인증된 계좌 재인증 방지

---

## 7. 전체 플로우 다이어그램

### 7.1 현재 Mock 플로우

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [사용자가 계좌 정보 입력]                                            │
│         │                                                           │
│         ▼                                                           │
│  bankAccountApi.requestVerification(bankCode, accountNum, holder)   │
│         │                                                           │
│         │ POST /api/bank-account/verify-request                     │
│         │ { bankCode, accountNum, accountHolder }                   │
│         ▼                                                           │
├─────────────────────────────────────────────────────────────────────┤
│                         BACKEND (Spring)                            │
├─────────────────────────────────────────────────────────────────────┤
│         │                                                           │
│         ▼                                                           │
│  [Mock 데이터 생성]                                                  │
│  - bankTranId: "MOCK-" + UUID                                       │
│  - verifyCode: 랜덤 4자리                                           │
│  - DB 저장                                                          │
│         │                                                           │
│         ▼                                                           │
│  [응답 반환]                                                         │
│  { bankTranId, printContent: verifyCode }                           │
│         │                                                           │
├─────────────────────────────────────────────────────────────────────┤
│                         FRONTEND (React)                             │
├─────────────────────────────────────────────────────────────────────┤
│         │                                                           │
│         ▼                                                           │
│  [화면에 인증코드 표시] (개발 모드)                                    │
│  "인증코드: 1234"                                                   │
│         │                                                           │
│         ▼                                                           │
│  [사용자가 인증코드 입력]                                             │
│         │                                                           │
│         ▼                                                           │
│  bankAccountApi.verifyAndRegister(bankTranId, verifyCode)           │
│         │                                                           │
│         │ POST /api/bank-account/verify                             │
│         │ { bankTranId, verifyCode }                                │
│         ▼                                                           │
├─────────────────────────────────────────────────────────────────────┤
│                         BACKEND (Spring)                            │
├─────────────────────────────────────────────────────────────────────┤
│         │                                                           │
│         ▼                                                           │
│  [DB에서 bankTranId로 조회]                                          │
│  [저장된 verifyCode와 비교]                                          │
│         │                                                           │
│    ┌────┴────┐                                                      │
│    │         │                                                      │
│    ▼         ▼                                                      │
│ [일치]    [불일치]                                                   │
│    │         │                                                      │
│    ▼         ▼                                                      │
│ [계좌 저장] [에러 반환]                                              │
│    │                                                                │
│    ▼                                                                │
│ [성공 응답]                                                          │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                         FRONTEND (React)                             │
├─────────────────────────────────────────────────────────────────────┤
│         │                                                           │
│         ▼                                                           │
│  [등록 완료! 계좌 정보 표시]                                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 실제 API 플로우 (미래)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                             │
├─────────────────────────────────────────────────────────────────────┤
│  [동일한 코드 사용]                                                   │
│         │                                                           │
│         │ POST /api/bank-account/verify-request                     │
│         ▼                                                           │
├─────────────────────────────────────────────────────────────────────┤
│                         BACKEND (Spring)                            │
├─────────────────────────────────────────────────────────────────────┤
│         │                                                           │
│         ▼                                                           │
│  [오픈뱅킹 API 호출]                                                 │
│         │                                                           │
│         │ 1. 토큰 발급/갱신                                          │
│         │ 2. 수취조회 (실명 확인)                                     │
│         │ 3. 1원 이체                                                │
│         ▼                                                           │
├─────────────────────────────────────────────────────────────────────┤
│                       금융결제원 (오픈뱅킹)                           │
├─────────────────────────────────────────────────────────────────────┤
│         │                                                           │
│         │ 실제 1원 이체 요청                                         │
│         ▼                                                           │
├─────────────────────────────────────────────────────────────────────┤
│                           은행 (신한, 국민 등)                        │
├─────────────────────────────────────────────────────────────────────┤
│         │                                                           │
│         ▼                                                           │
│  [사용자 계좌에 1원 입금]                                             │
│  입금자명: "MOA1234"                                                │
│         │                                                           │
├─────────────────────────────────────────────────────────────────────┤
│                         BACKEND (Spring)                            │
├─────────────────────────────────────────────────────────────────────┤
│         │                                                           │
│         ▼                                                           │
│  [응답 반환]                                                         │
│  { bankTranId, printContent: null }  ← 보안상 코드 미전달            │
│         │                                                           │
├─────────────────────────────────────────────────────────────────────┤
│                         FRONTEND (React)                             │
├─────────────────────────────────────────────────────────────────────┤
│         │                                                           │
│         ▼                                                           │
│  [안내 메시지 표시]                                                   │
│  "계좌로 1원이 입금되었습니다. 입금자명의 숫자 4자리를 입력하세요."     │
│         │                                                           │
│  [사용자가 은행 앱에서 입금내역 확인]                                  │
│  [인증코드 입력]                                                     │
│         │                                                           │
│         ▼                                                           │
│  [나머지 동일...]                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. 결론 및 권장사항

### 8.1 현재 상태 평가

| 항목 | 점수 | 코멘트 |
|------|------|--------|
| 프론트엔드 로직 | ⭐⭐⭐⭐⭐ | 실제 API 그대로 사용 가능 |
| UI/UX | ⭐⭐⭐⭐⭐ | 직관적인 3단계 플로우 |
| 에러 처리 | ⭐⭐⭐⭐ | 적절함 |
| 코드 구조 | ⭐⭐⭐⭐ | API 분리 잘 됨 |
| 문서화 | ⭐⭐ | 주석 부족 |

### 8.2 권장 액션

#### 즉시 수행 (프론트엔드)

1. **AccountRegisterPage.jsx 정리**
   - 삭제하거나 BankAccountPage로 리다이렉트
   - 라우트에서 제거

2. **개발 모드 분기 추가**
   ```javascript
   // 프로덕션에서는 인증코드 표시 안 함
   {import.meta.env.DEV && verifyCodeFromServer && (
       <Alert>인증코드: {verifyCodeFromServer}</Alert>
   )}
   ```

#### 실제 API 연동 시 (백엔드)

1. 금융결제원 오픈뱅킹 가입
2. API 인증 키 발급
3. 백엔드 API 구현 (위 코드 참고)
4. 테스트 환경에서 충분히 테스트
5. 프로덕션 배포

### 8.3 최종 정리

```
✅ 프론트엔드: 실제 API 사용 준비 완료
✅ 로직: 정확함, 보안 고려됨
⚠️ AccountRegisterPage: 정리 필요
⏳ 백엔드: 실제 오픈뱅킹 연동 필요
```

---

## 부록: 용어 설명

| 용어 | 설명 |
|------|------|
| 오픈뱅킹 | 금융결제원에서 제공하는 은행 API 통합 서비스 |
| 1원 인증 | 계좌에 1원을 입금하여 소유자를 확인하는 방식 |
| bankTranId | 은행 거래 고유번호, 거래 추적에 사용 |
| printContent | 입금자명에 표시되는 내용 (인증코드 포함) |
| Mock | 실제 API 대신 가짜 데이터를 반환하는 테스트용 구현 |
| httpClient | axios 기반 HTTP 요청 유틸리티 |

---

*이 문서는 초보 개발자도 이해할 수 있도록 작성되었습니다.*
*질문이 있으면 팀 리더에게 문의하세요.*
