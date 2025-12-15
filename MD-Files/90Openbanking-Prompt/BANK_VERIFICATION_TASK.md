# 1원 인증 데모 버전 구현 태스크

> 새 세션에서 이 파일을 읽고 구현을 시작하세요.

---

## 프로젝트 정보

- **경로**: `C:\sol\React\4beans-moa-front\4beans-moa-front`
- **백엔드**: `C:\sol\React\4beans-moa-front\4beans-moa-backend`
- **스키마**: `4beans-moa-backend\src\main\resources\moa_schema_20251211_1.sql`

---

## 구현 목표

실제 오픈뱅킹 API 없이 **1원 인증을 데모로 구현**
- Resend 이메일로 인증코드 발송
- 가상 은행 앱 UI로 즉시 확인 가능
- 실제 서비스처럼 느껴지는 UX

---

## 기존 테이블 (변경 없이 사용)

### ACCOUNT_VERIFICATION (인증 세션)
```sql
VERIFICATION_ID, USER_ID, BANK_TRAN_ID, BANK_CODE, ACCOUNT_NUM,
ACCOUNT_HOLDER, VERIFY_CODE(4자리), ATTEMPT_COUNT, STATUS, EXPIRED_AT
```

### ACCOUNT (인증 완료 계좌)
```sql
ACCOUNT_ID, USER_ID, BANK_CODE, BANK_NAME, ACCOUNT_NUMBER,
ACCOUNT_HOLDER, IS_VERIFIED, VERIFY_DATE
```

### 이메일
- USERS.USER_ID가 이메일 주소 (별도 컬럼 없음)

---

## 생성할 파일

```
src/
├── pages/account/
│   └── BankVerificationPage.jsx         # 메인 페이지
│
├── components/bank-verification/        # 새 폴더
│   ├── BankSelectionStep.jsx            # Step 1: 계좌 입력
│   ├── ProcessingStep.jsx               # Step 2: 로딩 (4초)
│   ├── VerificationStep.jsx             # Step 3: 코드 입력
│   ├── CompletionStep.jsx               # Step 4: 완료
│   ├── VirtualBankModal.jsx             # 가상 은행 앱 (토스 스타일)
│   ├── BankSelector.jsx                 # 은행 선택 드롭다운
│   ├── CodeInput.jsx                    # 4자리 입력 UI
│   └── CountdownTimer.jsx               # 타이머
│
├── store/
│   └── bankVerificationStore.js         # Zustand 상태관리
│
└── api/
    └── bankAccountApi.js                # 수정 (기존 파일)
```

---

## 플로우

```
[1. 입력]        [2. 로딩]         [3. 인증]        [4. 완료]
 은행 선택    →   4초 딜레이    →   코드 입력   →    🎉
 계좌번호         애니메이션        📧 이메일
 예금주명         이메일 발송       🏦 가상은행
```

---

## API 명세

### POST /api/bank-account/verify-request
```json
Request:  { "bankCode", "accountNum", "accountHolder" }
Response: { "bankTranId", "maskedAccount", "expiresAt", "verifyCode" }
```

### POST /api/bank-account/verify
```json
Request:  { "bankTranId", "code" }
Response: { "accountId", "bankName", "maskedAccountNumber" }
```

### POST /api/bank-account/resend
```json
Request:  { "bankTranId" }
Response: { "bankTranId", "expiresAt" }
```

---

## UI 스타일

- **전체**: Tailwind CSS, Framer Motion
- **가상 은행 모달**: 토스 스타일
- **코드 입력**: 4개 분리된 박스, 자동 포커스 이동
- **로딩**: 단계별 체크 애니메이션

---

## 삭제할 파일

- `src/pages/account/BankAccountPage.jsx`
- `src/pages/user/register/AccountRegisterPage.jsx`

---

## 상세 설계서

자세한 내용은 아래 파일 참고:
- `BANK_VERIFICATION_FINAL_PLAN.md` - 최종 계획서
- `OPENBANKING_GUIDE.md` - 오픈뱅킹 설명

---

## 시작 명령

```
이 파일(BANK_VERIFICATION_TASK.md)과 BANK_VERIFICATION_FINAL_PLAN.md를 읽고
1원 인증 데모 버전 구현을 시작해줘. Phase 1부터 순서대로 진행해.
```
