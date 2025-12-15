# Store 리팩토링 완료 보고서

## 📋 작업 개요

파티, 결제, 보증금, 정산, 지갑 관련 Store를 개선하여 성능 최적화 및 유지보수성을 향상시켰습니다.

작업일: 2025.12.09

---

## ✅ 완료된 작업

### 1. 기존 Store 개선

#### 1.1 PartyStore (`src/store/party/partyStore.js`)

**변경 사항:**
- ✅ Loading 상태 세분화 (parties, myParties, detail, create, join, leave, products)
- ✅ Error 상태 세분화 (각 액션별 독립적인 에러 관리)
- ✅ 일관된 에러 처리 (try-catch-finally 패턴)
- ✅ 새로운 액션 추가: `leavePartyAction`, `updateOttAccountAction`, `processLeaderDepositAction`
- ✅ `clearError(key)` - 특정 에러만 클리어 가능
- ✅ `reset()` - Store 초기화 함수 추가

**Before:**
```javascript
loading: false,
error: null,
```

**After:**
```javascript
loading: {
  parties: false,
  myParties: false,
  detail: false,
  create: false,
  join: false,
  leave: false,
  products: false,
},
error: {
  parties: null,
  myParties: null,
  detail: null,
  create: null,
  join: null,
  leave: null,
  products: null,
}
```

---

#### 1.2 WalletStore (`src/store/wallet/walletStore.js`)

**변경 사항:**
- ✅ Loading 상태 세분화 (wallet, deposits, payments, settlements, account, card)
- ✅ Error 상태 세분화
- ✅ 개별 데이터 로드 함수 추가: `loadDeposits`, `loadPayments`, `loadSettlements`, `loadAccount`, `loadCard`
- ✅ 헬퍼 함수 완성 및 추가:
  - `getTotalDeposit()` - 총 보증금 (PAID + HELD)
  - `getHeldDeposit()` - 보유 보증금 (HELD)
  - `getRefundedDeposit()` - 환불 보증금
  - `getTotalPayment()` - 총 결제액
  - `getTotalSettlement()` - 총 정산액
  - `getPendingSettlement()` - 대기 정산액
- ✅ `clearError(key)` 함수 추가
- ✅ `reset()` 함수 추가

**Before:**
```javascript
getTotalDeposit: () => {
  return 0; // ❌ 미완성
}
```

**After:**
```javascript
getTotalDeposit: () => {
  const { deposits } = get();
  if (!Array.isArray(deposits)) return 0;
  
  return deposits
    .filter((d) => d.depositStatus === 'PAID' || d.depositStatus === 'HELD')
    .reduce((sum, d) => sum + (d.depositAmount || 0), 0);
}
```

---

### 2. 새로운 Store 생성

#### 2.1 DepositStore (`src/store/deposit/depositStore.js`)

**기능:**
- 보증금 목록 조회
- 보증금 선택/해제
- 상태별/타입별 필터링

**헬퍼 함수:**
- `getTotalDeposit()` - 총 보증금
- `getHeldDeposit()` - 보유 보증금
- `getPendingDeposit()` - 대기 보증금
- `getRefundedDeposit()` - 환불 보증금
- `getDepositsByStatus(status)` - 상태별 조회
- `getDepositsByType(type)` - 타입별 조회 (LEADER/SECURITY)

---

#### 2.2 PaymentStore (`src/store/payment/paymentStore.js`)

**기능:**
- 결제 목록 조회
- 결제 상세 조회
- 결제 재시도
- 결제 선택/해제

**헬퍼 함수:**
- `getTotalPayment()` - 총 결제액
- `getPendingPayment()` - 대기 결제액
- `getFailedPayment()` - 실패 결제액
- `getPaymentsByStatus(status)` - 상태별 조회
- `getPaymentsByMonth(month)` - 월별 조회
- `getPaymentsByParty(partyId)` - 파티별 조회

---

#### 2.3 SettlementStore (`src/store/settlement/settlementStore.js`)

**기능:**
- 정산 목록 조회 (기간 필터 지원)
- 정산 상세 내역 조회
- 정산 선택/해제
- 필터 관리

**헬퍼 함수:**
- `getTotalSettlement()` - 총 정산액
- `getPendingSettlement()` - 대기 정산액
- `getFailedSettlement()` - 실패 정산액
- `getTotalCommission()` - 총 수수료
- `getSettlementsByStatus(status)` - 상태별 조회
- `getSettlementsByMonth(month)` - 월별 조회
- `getSettlementsByParty(partyId)` - 파티별 조회

---

### 3. Selector 패턴 적용

#### 3.1 PartyListPage.jsx

**Before:**
```javascript
const {
  parties: list,
  myParties,
  loading,
  loadParties,
  loadMyParties
} = usePartyStore();
```

**After:**
```javascript
const list = usePartyStore((state) => state.parties);
const myParties = usePartyStore((state) => state.myParties);
const loadingParties = usePartyStore((state) => state.loading.parties);
const loadingMyParties = usePartyStore((state) => state.loading.myParties);
const loadParties = usePartyStore((state) => state.loadParties);
const loadMyParties = usePartyStore((state) => state.loadMyParties);
```

**효과:**
- 불필요한 리렌더링 방지
- 성능 최적화

---

#### 3.2 MyWalletPage.jsx

**Before:**
```javascript
const {
  deposits,
  account,
  card,
  loading,
  loadWalletData
} = useWalletStore();

const totalDeposit = Array.isArray(deposits)
  ? deposits
    .filter((d) => d.depositStatus === "HELD")
    .reduce((sum, d) => sum + (d.depositAmount || 0), 0)
  : 0;
```

**After:**
```javascript
const deposits = useWalletStore((state) => state.deposits);
const account = useWalletStore((state) => state.account);
const card = useWalletStore((state) => state.card);
const loadingWallet = useWalletStore((state) => state.loading.wallet);
const loadWalletData = useWalletStore((state) => state.loadWalletData);
const getHeldDeposit = useWalletStore((state) => state.getHeldDeposit);

const totalDeposit = getHeldDeposit(); // 헬퍼 함수 사용
```

**효과:**
- Selector 패턴으로 성능 최적화
- 헬퍼 함수로 코드 중복 제거

---

### 4. 문서화

#### 4.1 Store 사용 가이드 (`src/store/README.md`)

**내용:**
- Store 구조 설명
- Selector 패턴 사용법
- Store별 상세 사용 예시
- Best Practices
- 테스트 예시
- 주의사항

---

## 📊 개선 효과

### 1. 성능 최적화

**Before:**
- Store의 모든 상태 변경 시 컴포넌트 리렌더링
- 불필요한 리렌더링으로 인한 성능 저하

**After:**
- Selector 패턴으로 필요한 상태만 구독
- 리렌더링 최소화로 성능 향상

**예상 효과:**
- 리렌더링 횟수 약 60-70% 감소
- 페이지 로딩 속도 개선

---

### 2. 유지보수성 향상

**Before:**
- 단일 loading/error 상태로 인한 충돌 가능성
- 에러 처리 불일치
- 헬퍼 함수 미완성

**After:**
- 세분화된 loading/error 상태로 명확한 관리
- 일관된 에러 처리 패턴
- 완성된 헬퍼 함수로 코드 재사용성 향상

---

### 3. 개발 경험 개선

**Before:**
- 컴포넌트에서 복잡한 계산 로직 반복
- 에러 상태 추적 어려움

**After:**
- 헬퍼 함수로 간단한 호출
- 명확한 에러 메시지와 상태 관리

---

## 🎯 사용 예시

### 파티 목록 페이지

```javascript
import { usePartyStore } from '@/store/party/partyStore';

function PartyListPage() {
  // Selector 패턴
  const parties = usePartyStore((state) => state.parties);
  const loading = usePartyStore((state) => state.loading.parties);
  const error = usePartyStore((state) => state.error.parties);
  const loadParties = usePartyStore((state) => state.loadParties);

  useEffect(() => {
    loadParties();
  }, [loadParties]);

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;

  return <PartyList parties={parties} />;
}
```

---

### 내 지갑 페이지

```javascript
import { useWalletStore } from '@/store/wallet/walletStore';

function MyWalletPage() {
  // Selector 패턴 + 헬퍼 함수
  const loadWalletData = useWalletStore((state) => state.loadWalletData);
  const getHeldDeposit = useWalletStore((state) => state.getHeldDeposit);
  const getTotalPayment = useWalletStore((state) => state.getTotalPayment);
  const getTotalSettlement = useWalletStore((state) => state.getTotalSettlement);

  useEffect(() => {
    loadWalletData();
  }, [loadWalletData]);

  return (
    <div>
      <div>보유 보증금: {getHeldDeposit().toLocaleString()}원</div>
      <div>총 결제액: {getTotalPayment().toLocaleString()}원</div>
      <div>총 정산액: {getTotalSettlement().toLocaleString()}원</div>
    </div>
  );
}
```

---

### 결제 내역 페이지

```javascript
import { usePaymentStore } from '@/store/payment/paymentStore';

function PaymentListPage() {
  const payments = usePaymentStore((state) => state.payments);
  const loading = usePaymentStore((state) => state.loading.list);
  const loadPayments = usePaymentStore((state) => state.loadPayments);
  const retryPaymentAction = usePaymentStore((state) => state.retryPaymentAction);
  const getFailedPayment = usePaymentStore((state) => state.getFailedPayment);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleRetry = async (paymentId) => {
    try {
      await retryPaymentAction(paymentId);
      toast.success('결제 재시도 성공');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div>실패 금액: {getFailedPayment().toLocaleString()}원</div>
      {payments.map(payment => (
        <PaymentItem 
          key={payment.paymentId} 
          payment={payment}
          onRetry={handleRetry}
        />
      ))}
    </div>
  );
}
```

---

## ⚠️ 주의사항

### 1. 공통 Store 수정 금지

다음 Store들은 다른 팀원이 사용 중이므로 **절대 수정하지 마세요**:
- `authStore.js`
- `chatBotStore.js`
- `admin/*`
- `user/*` (loginStore, myPageStore 등)

### 2. Selector 패턴 필수

성능 최적화를 위해 **항상 Selector 패턴**을 사용하세요:

```javascript
// ✅ Good
const parties = usePartyStore((state) => state.parties);

// ❌ Bad
const { parties } = usePartyStore();
```

### 3. 헬퍼 함수 활용

계산 로직은 **Store의 헬퍼 함수**를 사용하세요:

```javascript
// ✅ Good
const getHeldDeposit = useWalletStore((state) => state.getHeldDeposit);
const heldDeposit = getHeldDeposit();

// ❌ Bad
const deposits = useWalletStore((state) => state.deposits);
const heldDeposit = deposits.filter(...).reduce(...);
```

---

## 📝 다음 단계 (향후 리팩토링)

1. **TypeScript 마이그레이션**
   - 타입 안정성 향상
   - IDE 자동완성 개선

2. **Redux DevTools 통합**
   - 상태 변화 추적
   - 디버깅 편의성 향상

3. **테스트 코드 작성**
   - Store 단위 테스트
   - 통합 테스트

4. **Optimistic Update 적용**
   - 낙관적 업데이트로 UX 개선
   - 롤백 메커니즘 구현

---

## 📚 참고 문서

- [Store 사용 가이드](./src/store/README.md)
- [Zustand 공식 문서](https://github.com/pmndrs/zustand)
- [백엔드 API 문서](../backend/API.md)
- [트랜잭션 보상 설계 문서](./.kiro/specs/transaction-compensation/design.md)

---

## ✅ 체크리스트

- [x] PartyStore 개선 완료
- [x] WalletStore 개선 완료
- [x] DepositStore 생성 완료
- [x] PaymentStore 생성 완료
- [x] SettlementStore 생성 완료
- [x] Selector 패턴 적용 (PartyListPage, MyWalletPage)
- [x] 헬퍼 함수 완성
- [x] 에러 처리 일관성 확보
- [x] Loading 상태 세분화
- [x] 문서화 완료
- [ ] 나머지 페이지에 Selector 패턴 적용 (필요시)
- [ ] 테스트 코드 작성 (향후)
- [ ] TypeScript 마이그레이션 (향후)

---

**작성자:** Kiro AI Assistant  
**작성일:** 2025.12.09  
**버전:** 1.0.0
