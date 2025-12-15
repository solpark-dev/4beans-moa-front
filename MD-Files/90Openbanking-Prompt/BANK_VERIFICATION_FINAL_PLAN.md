# 1원 인증 데모 버전 - 최종 구현 계획

> 작성일: 2025-12-12
> 상태: 최종 확정

---

## 1. 핵심 요약

| 항목 | 내용 |
|------|------|
| **목표** | 실제 오픈뱅킹 없이 1원 인증 데모 구현 |
| **방식** | Resend 이메일 + 가상 은행 앱 UI |
| **DB 변경** | ❌ 없음 (기존 테이블 활용) |
| **이메일** | USERS 테이블의 USER_ID(이메일)에서 가져옴 |

---

## 2. 사용할 기존 테이블

### ACCOUNT_VERIFICATION (인증 세션)

```sql
-- 이미 존재, 변경 없음
VERIFICATION_ID    -- PK
USER_ID            -- 사용자 ID (= 이메일)
BANK_TRAN_ID       -- 거래고유번호 (UUID 생성)
BANK_CODE          -- 은행코드
ACCOUNT_NUM        -- 계좌번호
ACCOUNT_HOLDER     -- 예금주명
VERIFY_CODE        -- 4자리 인증코드 ⭐
ATTEMPT_COUNT      -- 시도 횟수 (max 3)
STATUS             -- PENDING/VERIFIED/EXPIRED/FAILED
EXPIRED_AT         -- 만료시간 (10분)
```

### ACCOUNT (인증 완료된 계좌)

```sql
-- 이미 존재, 변경 없음
ACCOUNT_ID         -- PK
USER_ID            -- 사용자 ID
BANK_CODE          -- 은행코드
BANK_NAME          -- 은행명
ACCOUNT_NUMBER     -- 계좌번호
ACCOUNT_HOLDER     -- 예금주명
IS_VERIFIED        -- 'Y'/'N'
VERIFY_DATE        -- 인증완료일
```

---

## 3. 전체 플로우

```
┌─────────────────────────────────────────────────────────────────────┐
│                        사용자 플로우                                  │
└─────────────────────────────────────────────────────────────────────┘

[1. 계좌 입력]
    │
    │  • 은행 선택 (로고 포함)
    │  • 계좌번호 입력
    │  • 예금주명 입력
    │
    ▼
[2. 처리 중] (3-5초 딜레이)
    │
    │  ✓ 계좌 정보 확인
    │  ✓ 예금주 실명 확인
    │  → 1원 입금 처리 중...
    │
    │  📧 이메일 발송 (USER_ID = 이메일 주소)
    │  💾 ACCOUNT_VERIFICATION INSERT
    │
    ▼
[3. 인증코드 입력]
    │
    │  ┌────────────────┬────────────────┐
    │  │ 📧 이메일 확인  │ 🏦 가상 은행앱  │
    │  │   (Resend)     │  (즉시 확인)   │
    │  └────────────────┴────────────────┘
    │
    │  [ _ ][ _ ][ _ ][ _ ]  ← 4자리 입력
    │  ⏱️ 09:45 남음
    │
    ▼
[4. 완료]
    │
    │  🎉 계좌 등록 완료!
    │  💾 ACCOUNT INSERT (IS_VERIFIED='Y')
    │
    ▼
[내 지갑으로 이동]
```

---

## 4. 파일 구조

```
src/
├── pages/
│   └── account/
│       └── BankVerificationPage.jsx      ⭐ 메인 페이지 (신규)
│
├── components/
│   └── bank-verification/                ⭐ 새 폴더
│       ├── BankSelectionStep.jsx         # Step 1: 계좌 입력
│       ├── ProcessingStep.jsx            # Step 2: 로딩 애니메이션
│       ├── VerificationStep.jsx          # Step 3: 코드 입력
│       ├── CompletionStep.jsx            # Step 4: 완료
│       ├── VirtualBankModal.jsx          # 가상 은행 앱 (토스 스타일)
│       ├── BankSelector.jsx              # 은행 선택 드롭다운
│       ├── CodeInput.jsx                 # 4자리 입력 UI
│       └── CountdownTimer.jsx            # 타이머
│
├── hooks/
│   └── bank-verification/
│       └── useBankVerification.js        # 인증 로직 훅
│
├── store/
│   └── bankVerificationStore.js          # Zustand 상태관리
│
└── api/
    └── bankAccountApi.js                 # 기존 파일 수정
```

---

## 5. API 명세

### 5.1 인증 요청

```
POST /api/bank-account/verify-request
```

**Request:**
```json
{
    "bankCode": "088",
    "accountNum": "110123456789",
    "accountHolder": "홍길동"
}
```

**Backend 처리:**
1. 4자리 랜덤 코드 생성
2. BANK_TRAN_ID 생성 (UUID)
3. ACCOUNT_VERIFICATION INSERT
4. Resend로 이메일 발송 (USER_ID = 이메일)
5. 응답 반환

**Response:**
```json
{
    "success": true,
    "data": {
        "bankTranId": "VRF-20251212-ABC123",
        "maskedAccount": "110-***-***789",
        "expiresAt": "2025-12-12T14:40:00Z",
        "verifyCode": "1234"    // ⚠️ 가상 은행 모달용 (프론트에서만 사용)
    }
}
```

### 5.2 인증 검증

```
POST /api/bank-account/verify
```

**Request:**
```json
{
    "bankTranId": "VRF-20251212-ABC123",
    "code": "1234"
}
```

**Backend 처리:**
1. ACCOUNT_VERIFICATION에서 조회
2. 만료 확인, 시도 횟수 확인
3. 코드 비교
4. 성공 시: STATUS='VERIFIED', ACCOUNT INSERT
5. 실패 시: ATTEMPT_COUNT++

**Response (성공):**
```json
{
    "success": true,
    "data": {
        "accountId": 123,
        "bankName": "신한은행",
        "maskedAccountNumber": "110-***-***789"
    }
}
```

**Response (실패):**
```json
{
    "success": false,
    "error": {
        "code": "INVALID_CODE",
        "message": "인증코드가 일치하지 않습니다.",
        "remainingAttempts": 2
    }
}
```

### 5.3 재전송

```
POST /api/bank-account/resend
```

**Request:**
```json
{
    "bankTranId": "VRF-20251212-ABC123"
}
```

**Backend 처리:**
1. 기존 인증 만료 처리
2. 새 인증 생성
3. 이메일 재발송

---

## 6. 컴포넌트 상세

### 6.1 BankVerificationPage.jsx

```jsx
// 메인 페이지 - Step 관리
const [step, setStep] = useState('input');
// 'input' → 'processing' → 'verify' → 'complete'

return (
    <div>
        {step === 'input' && <BankSelectionStep />}
        {step === 'processing' && <ProcessingStep />}
        {step === 'verify' && <VerificationStep />}
        {step === 'complete' && <CompletionStep />}

        <VirtualBankModal />  {/* 항상 렌더링, isOpen으로 제어 */}
    </div>
);
```

### 6.2 BankSelectionStep.jsx

```
┌─────────────────────────────────────────┐
│  🏦 정산받을 계좌를 등록해주세요          │
│                                         │
│  은행 선택                               │
│  ┌─────────────────────────────────┐    │
│  │ [로고] 신한은행              ▼  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  계좌번호                                │
│  ┌─────────────────────────────────┐    │
│  │ 110-123-456789                  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  예금주명                                │
│  ┌─────────────────────────────────┐    │
│  │ 홍길동                          │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │         1원 인증 요청            │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### 6.3 ProcessingStep.jsx

```
┌─────────────────────────────────────────┐
│                                         │
│              🏦                         │
│                                         │
│     계좌 정보를 확인하고 있습니다          │
│                                         │
│     ████████████░░░░░░░░  67%          │
│                                         │
│     ✓ 계좌 정보 확인                     │
│     ✓ 예금주 실명 확인                   │
│     → 1원 입금 처리 중...                │
│                                         │
└─────────────────────────────────────────┘

애니메이션 시퀀스 (총 4초):
- 0-1초: "계좌 정보 확인 중..." → ✓
- 1-2.5초: "예금주 실명 확인 중..." → ✓
- 2.5-4초: "1원 입금 처리 중..." → 완료
```

### 6.4 VerificationStep.jsx

```
┌─────────────────────────────────────────┐
│  ✅ 1원이 입금되었습니다!                 │
│                                         │
│  신한은행 110-***-***789                │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ┌─────────────┐  ┌─────────────┐       │
│  │ 📧 이메일    │  │ 🏦 가상 은행 │       │
│  │    확인     │  │    앱 보기   │       │
│  └─────────────┘  └─────────────┘       │
│                                         │
│  인증코드 4자리                          │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐               │
│  │ 1 │ │ 2 │ │ 3 │ │ 4 │               │
│  └───┘ └───┘ └───┘ └───┘               │
│                                         │
│           ⏱️ 09:45 남음                 │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │          인증 완료               │    │
│  └─────────────────────────────────┘    │
│                                         │
│       코드를 못 받으셨나요? 재전송        │
└─────────────────────────────────────────┘
```

### 6.5 VirtualBankModal.jsx (토스 스타일)

```
┌─────────────────────────────────────────┐
│                                         │
│  ─────────────────────────────────────  │
│  4beans 가상은행                    [X] │
│  ─────────────────────────────────────  │
│                                         │
│  [신한] 신한은행                         │
│        110-***-***789                  │
│        홍*동                            │
│                                         │
│  ─────────────────────────────────────  │
│  오늘의 입금내역                         │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  📥 입금                  14:30 │    │
│  │                                 │    │
│  │  +1원                           │    │
│  │  MOA1234  ← 여기!               │    │
│  │      ↑                          │    │
│  │  숫자 4자리가 인증코드입니다      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ─────────────────────────────────────  │
│  💡 실제 서비스에서는 본인의 은행 앱에서  │
│     입금 내역을 확인합니다. (데모)       │
│  ─────────────────────────────────────  │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │          확인했어요              │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

### 6.6 CodeInput.jsx

```jsx
// 4개 분리된 입력 필드
// 자동 포커스 이동
// 붙여넣기 지원
// 에러 시 흔들림 애니메이션

<div className="flex gap-3 justify-center">
    {[0,1,2,3].map(i => (
        <input
            key={i}
            ref={refs[i]}
            value={code[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-14 h-16 text-center text-2xl font-bold
                       border-2 rounded-xl focus:border-blue-500"
        />
    ))}
</div>
```

---

## 7. 이메일 템플릿

### 제목
```
[4beans] 계좌 인증을 위한 1원이 입금되었습니다
```

### 본문 (HTML)

```
┌─────────────────────────────────────────┐
│  [4beans 로고]                          │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│  🏦 입금 알림                            │
│                                         │
│  고객님의 계좌로 1원이 입금되었습니다.      │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  입금 금액     1원               │    │
│  │  입금자명      MOA1234           │    │
│  │  입금 일시     2025.12.12 14:30  │    │
│  │  받는 계좌     신한 110-***-789  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│  💡 인증 방법                            │
│  입금자명 "MOA1234"에서                  │
│  숫자 4자리 "1234"를 입력하세요           │
│                                         │
│  ⏰ 유효시간: 10분                       │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│  ※ 데모용 메일입니다.                    │
│  ※ 실제 입금은 발생하지 않습니다.         │
│                                         │
└─────────────────────────────────────────┘
```

---

## 8. 상태 관리 (Zustand)

```javascript
// src/store/bankVerificationStore.js

const useBankVerificationStore = create((set, get) => ({
    // Step 관리
    step: 'input',  // input | processing | verify | complete

    // 입력 데이터
    formData: {
        bankCode: '',
        accountNum: '',
        accountHolder: ''
    },

    // 인증 데이터
    verification: {
        bankTranId: null,
        maskedAccount: '',
        expiresAt: null,
        verifyCode: '',     // 가상 은행 모달용
        remainingAttempts: 3
    },

    // UI 상태
    isLoading: false,
    error: null,
    showVirtualBankModal: false,

    // Actions
    setStep: (step) => set({ step }),
    setFormData: (data) => set({ formData: { ...get().formData, ...data } }),
    setVerification: (data) => set({ verification: { ...get().verification, ...data } }),
    toggleVirtualBankModal: () => set({ showVirtualBankModal: !get().showVirtualBankModal }),
    reset: () => set({ step: 'input', formData: {...}, verification: {...}, error: null })
}));
```

---

## 9. 라우트 설정

```jsx
// App.jsx

// 기존 삭제
// <Route path="/user/account-register" element={<AccountRegisterPage />} />

// 신규 추가
import BankVerificationPage from './pages/account/BankVerificationPage';

<Route path="/account/verify" element={<BankVerificationPage />} />
// 또는
<Route path="/user/account-register" element={<BankVerificationPage />} />
```

---

## 10. 기존 파일 처리

| 파일 | 액션 |
|------|------|
| `BankAccountPage.jsx` | 삭제 또는 보관 |
| `AccountRegisterPage.jsx` | 삭제 |
| `bankAccountApi.js` | 수정 (API 함수 업데이트) |

---

## 11. 구현 순서

### Phase 1: 기본 구조 (1일차)

- [ ] `bank-verification/` 폴더 생성
- [ ] `BankVerificationPage.jsx` 생성 (빈 껍데기)
- [ ] `bankVerificationStore.js` 생성
- [ ] 라우트 추가

### Phase 2: Step 1-2 UI (2일차)

- [ ] `BankSelector.jsx` - 은행 선택 (로고 포함)
- [ ] `BankSelectionStep.jsx` - 계좌 입력 폼
- [ ] `ProcessingStep.jsx` - 로딩 애니메이션

### Phase 3: Step 3-4 UI (3일차)

- [ ] `CodeInput.jsx` - 4자리 입력
- [ ] `CountdownTimer.jsx` - 타이머
- [ ] `VerificationStep.jsx` - 인증 화면
- [ ] `CompletionStep.jsx` - 완료 화면

### Phase 4: 가상 은행 모달 (4일차)

- [ ] `VirtualBankModal.jsx` - 토스 스타일 UI
- [ ] 입금 내역 애니메이션
- [ ] 인증코드 하이라이트

### Phase 5: API 연동 (5일차)

- [ ] `bankAccountApi.js` 수정
- [ ] 백엔드 API 구현
- [ ] Resend 이메일 연동
- [ ] 이메일 템플릿 작성

### Phase 6: 통합 테스트 (6일차)

- [ ] 전체 플로우 테스트
- [ ] 에러 케이스 테스트
- [ ] 반응형 확인
- [ ] 기존 파일 정리

---

## 12. 체크리스트

### 프론트엔드

- [ ] Step 전환 자연스러움
- [ ] 로딩 애니메이션 3-5초
- [ ] 4자리 입력 자동 포커스
- [ ] 타이머 정확히 작동
- [ ] 가상 은행 모달 토스 스타일
- [ ] 에러 메시지 표시
- [ ] 재전송 기능
- [ ] 반응형 (모바일)

### 백엔드

- [ ] 인증 요청 API
- [ ] 인증 검증 API
- [ ] 재전송 API
- [ ] Resend 연동
- [ ] 만료 처리
- [ ] 시도 횟수 제한

### 이메일

- [ ] HTML 템플릿
- [ ] 은행 알림 스타일
- [ ] 인증코드 강조
- [ ] 유효시간 안내

---

*이 계획서를 기반으로 구현을 진행합니다.*
