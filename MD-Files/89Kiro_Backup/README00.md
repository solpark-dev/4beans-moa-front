# Store 사용 가이드

## 📚 개요

이 프로젝트는 Zustand를 사용하여 상태 관리를 합니다. 각 도메인별로 Store가 분리되어 있으며, Selector 패턴을 사용하여 성능을 최적화합니다.

---

## 🗂️ Store 구조

```
store/
├── authStore.js              # 인증 (전역, persist)
├── chatBotStore.js           # 챗봇 (전역)
├── admin/                    # 관리자 기능
│   ├── adminUserStore.js
│   ├── addBlacklistStore.js
│   └── ...
├── party/                    # 파티 관리
│   └── partyStore.js
├── user/                     # 사용자 기능
│   ├── loginStore.js
│   ├── myPageStore.js
│   └── ...
├── wallet/                   # 지갑 (통합)
│   └── walletStore.js
├── deposit/                  # 보증금
│   └── depositStore.js
├── payment/                  # 결제
│   └── paymentStore.js
└── settlement/               # 정산
    └── settlementStore.js
```

---

## ✅ Selector 패턴 사용법

### ❌ 잘못된 사용 (전체 구독)

```javascript
// 모든 상태 변경 시 리렌더링 발생
const { parties, loading, error } = usePartyStore();
```

### ✅ 올바른 사용 (선택적 구독)

```javascript
// 필요한 상태만 구독하여 불필요한 리렌더링 방지
const parties = usePartyStore((state) => state.parties);
const loading = usePartyStore((state) => state.loading.parties);
const loadParties = usePartyStore((state) => state.loadParties);
```

---

## 📦 Store별 사용 예시

### 1. PartyStore

```javascript
import { usePartyStore } from '@/store/party/partyStore';

function PartyListPage() {
  // Selector 패턴으로 필요한 것만 구독
  const parties = usePartyStore((state) => state.parties);
  const myParties = usePartyStore((state) => state.myParties);
  const loadingParties = usePartyStore((state) => state.loading.parties);
  const errorParties = usePartyStore((state) => state.error.parties);
  const loadParties = usePartyStore((state) => state.loadParties);
  const loadMyParties = usePartyStore((state) => state.loadMyParties);

  useEffect(() => {
    loadParties();
    loadMyParties();
  }, [loadParties, loadMyParties]);

  if (loadingParties) return <div>Loading...</div>;
  if (errorParties) return <div>Error: {errorParties}</div>;

  return (
    <div>
      {parties.map(party => (
        <div key={party.partyId}>{party.productName}</div>
      ))}
    </div>
  );
}
```

**주요 기능:**
- `loadParties()` - 파티 목록 조회
- `loadMyParties()` - 내 파티 목록 조회
- `loadPartyDetail(id)` - 파티 상세 조회
- `createNewParty(data)` - 파티 생성
- `joinPartyAction(id, data)` - 파티 참여
- `leavePartyAction(id)` - 파티 탈퇴

**Loading 상태:**
- `loading.parties` - 파티 목록 로딩
- `loading.myParties` - 내 파티 로딩
- `loading.detail` - 파티 상세 로딩
- `loading.create` - 파티 생성 로딩
- `loading.join` - 파티 참여 로딩

---

### 2. WalletStore

```javascript
import { useWalletStore } from '@/store/wallet/walletStore';

function MyWalletPage() {
  // Selector 패턴
  const deposits = useWalletStore((state) => state.deposits);
  const account = useWalletStore((state) => state.account);
  const card = useWalletStore((state) => state.card);
  const loadingWallet = useWalletStore((state) => state.loading.wallet);
  const loadWalletData = useWalletStore((state) => state.loadWalletData);
  
  // 헬퍼 함수 사용
  const getHeldDeposit = useWalletStore((state) => state.getHeldDeposit);
  const getTotalPayment = useWalletStore((state) => state.getTotalPayment);
  const getTotalSettlement = useWalletStore((state) => state.getTotalSettlement);

  useEffect(() => {
    loadWalletData();
  }, [loadWalletData]);

  const heldDeposit = getHeldDeposit();
  const totalPayment = getTotalPayment();
  const totalSettlement = getTotalSettlement();

  return (
    <div>
      <div>보유 보증금: {heldDeposit.toLocaleString()}원</div>
      <div>총 결제액: {totalPayment.toLocaleString()}원</div>
      <div>총 정산액: {totalSettlement.toLocaleString()}원</div>
    </div>
  );
}
```

**주요 기능:**
- `loadWalletData()` - 전체 지갑 데이터 조회
- `loadDeposits()` - 보증금만 조회
- `loadPayments()` - 결제 내역만 조회
- `loadSettlements()` - 정산 내역만 조회
- `loadAccount()` - 계좌 정보만 조회
- `loadCard()` - 카드 정보만 조회

**헬퍼 함수:**
- `getTotalDeposit()` - 총 보증금 (PAID + HELD)
- `getHeldDeposit()` - 보유 중인 보증금 (HELD)
- `getRefundedDeposit()` - 환불된 보증금
- `getTotalPayment()` - 총 결제액 (PAID)
- `getTotalSettlement()` - 총 정산액 (COMPLETED)
- `getPendingSettlement()` - 대기 중인 정산액

---

### 3. DepositStore

```javascript
import { useDepositStore } from '@/store/deposit/depositStore';

function DepositListPage() {
  const deposits = useDepositStore((state) => state.deposits);
  const loadingList = useDepositStore((state) => state.loading.list);
  const loadDeposits = useDepositStore((state) => state.loadDeposits);
  
  // 헬퍼 함수
  const getHeldDeposit = useDepositStore((state) => state.getHeldDeposit);
  const getPendingDeposit = useDepositStore((state) => state.getPendingDeposit);
  const getDepositsByStatus = useDepositStore((state) => state.getDepositsByStatus);

  useEffect(() => {
    loadDeposits();
  }, [loadDeposits]);

  const heldDeposits = getDepositsByStatus('HELD');
  const pendingDeposits = getDepositsByStatus('PENDING');

  return (
    <div>
      <div>보유 보증금: {getHeldDeposit().toLocaleString()}원</div>
      <div>대기 보증금: {getPendingDeposit().toLocaleString()}원</div>
      
      <h3>보유 중인 보증금</h3>
      {heldDeposits.map(deposit => (
        <div key={deposit.depositId}>{deposit.depositAmount}</div>
      ))}
    </div>
  );
}
```

**주요 기능:**
- `loadDeposits()` - 보증금 목록 조회
- `selectDeposit(id)` - 보증금 선택
- `clearSelection()` - 선택 해제

**헬퍼 함수:**
- `getTotalDeposit()` - 총 보증금
- `getHeldDeposit()` - 보유 보증금
- `getPendingDeposit()` - 대기 보증금
- `getRefundedDeposit()` - 환불 보증금
- `getDepositsByStatus(status)` - 상태별 조회
- `getDepositsByType(type)` - 타입별 조회

---

### 4. PaymentStore

```javascript
import { usePaymentStore } from '@/store/payment/paymentStore';

function PaymentListPage() {
  const payments = usePaymentStore((state) => state.payments);
  const loadingList = usePaymentStore((state) => state.loading.list);
  const loadPayments = usePaymentStore((state) => state.loadPayments);
  const retryPaymentAction = usePaymentStore((state) => state.retryPaymentAction);
  
  // 헬퍼 함수
  const getTotalPayment = usePaymentStore((state) => state.getTotalPayment);
  const getFailedPayment = usePaymentStore((state) => state.getFailedPayment);
  const getPaymentsByStatus = usePaymentStore((state) => state.getPaymentsByStatus);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleRetry = async (paymentId) => {
    try {
      await retryPaymentAction(paymentId);
      alert('결제 재시도 성공');
    } catch (error) {
      alert('결제 재시도 실패: ' + error.message);
    }
  };

  const failedPayments = getPaymentsByStatus('FAILED');

  return (
    <div>
      <div>총 결제액: {getTotalPayment().toLocaleString()}원</div>
      <div>실패 금액: {getFailedPayment().toLocaleString()}원</div>
      
      <h3>실패한 결제</h3>
      {failedPayments.map(payment => (
        <div key={payment.paymentId}>
          {payment.paymentAmount}
          <button onClick={() => handleRetry(payment.paymentId)}>
            재시도
          </button>
        </div>
      ))}
    </div>
  );
}
```

**주요 기능:**
- `loadPayments()` - 결제 목록 조회
- `loadPaymentDetail(id)` - 결제 상세 조회
- `retryPaymentAction(id)` - 결제 재시도
- `selectPayment(id)` - 결제 선택

**헬퍼 함수:**
- `getTotalPayment()` - 총 결제액
- `getPendingPayment()` - 대기 결제액
- `getFailedPayment()` - 실패 결제액
- `getPaymentsByStatus(status)` - 상태별 조회
- `getPaymentsByMonth(month)` - 월별 조회
- `getPaymentsByParty(partyId)` - 파티별 조회

---

### 5. SettlementStore

```javascript
import { useSettlementStore } from '@/store/settlement/settlementStore';

function SettlementListPage() {
  const settlements = useSettlementStore((state) => state.settlements);
  const loadingList = useSettlementStore((state) => state.loading.list);
  const loadSettlements = useSettlementStore((state) => state.loadSettlements);
  const loadSettlementDetails = useSettlementStore((state) => state.loadSettlementDetails);
  
  // 헬퍼 함수
  const getTotalSettlement = useSettlementStore((state) => state.getTotalSettlement);
  const getPendingSettlement = useSettlementStore((state) => state.getPendingSettlement);
  const getTotalCommission = useSettlementStore((state) => state.getTotalCommission);

  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');

  useEffect(() => {
    loadSettlements(startDate, endDate);
  }, [loadSettlements, startDate, endDate]);

  const handleViewDetails = async (settlementId) => {
    try {
      const details = await loadSettlementDetails(settlementId);
      console.log('정산 상세:', details);
    } catch (error) {
      alert('상세 조회 실패: ' + error.message);
    }
  };

  return (
    <div>
      <div>총 정산액: {getTotalSettlement().toLocaleString()}원</div>
      <div>대기 정산액: {getPendingSettlement().toLocaleString()}원</div>
      <div>총 수수료: {getTotalCommission().toLocaleString()}원</div>
      
      {settlements.map(settlement => (
        <div key={settlement.settlementId}>
          {settlement.netAmount}
          <button onClick={() => handleViewDetails(settlement.settlementId)}>
            상세보기
          </button>
        </div>
      ))}
    </div>
  );
}
```

**주요 기능:**
- `loadSettlements(start, end)` - 정산 목록 조회 (기간 필터)
- `loadMySettlements()` - 내 정산 목록 조회
- `loadSettlementDetails(id)` - 정산 상세 내역 조회
- `selectSettlement(id)` - 정산 선택
- `setFilters(start, end)` - 필터 설정

**헬퍼 함수:**
- `getTotalSettlement()` - 총 정산액
- `getPendingSettlement()` - 대기 정산액
- `getFailedSettlement()` - 실패 정산액
- `getTotalCommission()` - 총 수수료
- `getSettlementsByStatus(status)` - 상태별 조회
- `getSettlementsByMonth(month)` - 월별 조회
- `getSettlementsByParty(partyId)` - 파티별 조회

---

## 🎯 Best Practices

### 1. Selector 패턴 사용

```javascript
// ✅ Good - 필요한 것만 구독
const parties = usePartyStore((state) => state.parties);
const loading = usePartyStore((state) => state.loading.parties);

// ❌ Bad - 전체 구독
const { parties, loading } = usePartyStore();
```

### 2. 헬퍼 함수 활용

```javascript
// ✅ Good - Store의 헬퍼 함수 사용
const getHeldDeposit = useWalletStore((state) => state.getHeldDeposit);
const heldDeposit = getHeldDeposit();

// ❌ Bad - 컴포넌트에서 직접 계산
const deposits = useWalletStore((state) => state.deposits);
const heldDeposit = deposits
  .filter(d => d.depositStatus === 'HELD')
  .reduce((sum, d) => sum + d.depositAmount, 0);
```

### 3. 에러 처리

```javascript
const error = usePartyStore((state) => state.error.parties);
const clearError = usePartyStore((state) => state.clearError);

useEffect(() => {
  if (error) {
    toast.error(error);
    clearError('parties'); // 특정 에러만 클리어
  }
}, [error, clearError]);
```

### 4. Loading 상태 처리

```javascript
const loadingParties = usePartyStore((state) => state.loading.parties);
const loadingDetail = usePartyStore((state) => state.loading.detail);

// 개별 loading 상태 사용
if (loadingParties) return <Spinner />;
if (loadingDetail) return <DetailSkeleton />;
```

---

## 🔄 Store 간 데이터 동기화

### WalletStore와 개별 Store 관계

- **WalletStore**: 전체 지갑 데이터를 한 번에 조회 (대시보드용)
- **DepositStore**: 보증금 상세 관리 (보증금 페이지용)
- **PaymentStore**: 결제 상세 관리 (결제 페이지용)
- **SettlementStore**: 정산 상세 관리 (정산 페이지용)

```javascript
// 대시보드: WalletStore 사용
function Dashboard() {
  const loadWalletData = useWalletStore((state) => state.loadWalletData);
  const getHeldDeposit = useWalletStore((state) => state.getHeldDeposit);
  
  useEffect(() => {
    loadWalletData(); // 한 번에 모든 데이터 로드
  }, []);
  
  return <div>보유 보증금: {getHeldDeposit()}</div>;
}

// 보증금 상세 페이지: DepositStore 사용
function DepositPage() {
  const loadDeposits = useDepositStore((state) => state.loadDeposits);
  const deposits = useDepositStore((state) => state.deposits);
  
  useEffect(() => {
    loadDeposits(); // 보증금만 로드
  }, []);
  
  return <div>{deposits.map(...)}</div>;
}
```

---

## 🧪 테스트 예시

```javascript
import { renderHook, act } from '@testing-library/react';
import { usePartyStore } from '@/store/party/partyStore';

describe('PartyStore', () => {
  it('should load parties', async () => {
    const { result } = renderHook(() => usePartyStore());
    
    await act(async () => {
      await result.current.loadParties();
    });
    
    expect(result.current.parties).toHaveLength(5);
    expect(result.current.loading.parties).toBe(false);
  });
  
  it('should handle error', async () => {
    const { result } = renderHook(() => usePartyStore());
    
    // Mock API to throw error
    await act(async () => {
      await result.current.loadParties();
    });
    
    expect(result.current.error.parties).toBeTruthy();
  });
});
```

---

## 📝 주의사항

1. **공통 Store 수정 금지**: `authStore`, `chatBotStore`, `admin/*`, `user/*` 등은 다른 팀원이 사용 중이므로 수정하지 마세요.

2. **Selector 패턴 필수**: 성능 최적화를 위해 항상 Selector 패턴을 사용하세요.

3. **에러 처리**: 모든 비동기 액션은 try-catch로 에러를 처리하고 error 상태에 저장합니다.

4. **Loading 세분화**: 각 액션별로 독립적인 loading 상태를 사용하세요.

5. **헬퍼 함수 활용**: 계산 로직은 Store의 헬퍼 함수를 사용하여 중복을 방지하세요.

---

## 🔗 관련 문서

- [Zustand 공식 문서](https://github.com/pmndrs/zustand)
- [Selector 패턴 가이드](https://github.com/pmndrs/zustand#selecting-multiple-state-slices)
- [백엔드 API 문서](../../backend/API.md)
