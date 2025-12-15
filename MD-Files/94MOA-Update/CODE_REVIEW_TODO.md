# 코드 리뷰 수정 사항 목록

> 검토일: 2025-12-12
> 기준: standard.txt (설계표준)

---

## 1. 로그 코드 수정

### 1.1 삭제 필요 (디버그 로그)

```
파일: src/hooks/push/usePushNotification.js
라인 28: console.log("알림 데이터:", newData);
라인 29: console.log("sentAt 값들:", newData.map(n => n.sentAt));
조치: 두 줄 모두 삭제
```

```
파일: src/components/subscription/AddSubscriptionModal.jsx
라인 38: console.log('=== 구독 신청 디버깅 ===');
라인 39: console.log('전달받은 user:', user);
라인 40: console.log('productId:', productId);
라인 41: console.log('startDate:', startDate);
라인 42: console.log('endDate:', endDate);
라인 52: console.log('전송할 requestBody:', requestBody);
라인 55: console.log('응답:', response);
조치: 7줄 모두 삭제
```

### 1.2 console.log → console.error 변경

```
파일: src/hooks/user/useOtp.js
라인 26: console.log(e) → console.error(e)
라인 75: console.log(e) → console.error(e)
```

```
파일: src/hooks/auth/useResetPassword.js
라인 64: console.log(err) → console.error(err)
라인 117: console.log(err) → console.error(err)
```

### 1.3 로그 메시지 언어 통일 (선택사항)

```
파일: src/hooks/admin/useAdminDashboard.js
라인 17: "대시보드 통계 조회 실패:" → "Failed to fetch dashboard stats:" (영어로 통일 시)
```

---

## 2. 메서드명 수정 (standard.txt 기준)

### 표준 명명 규칙
| 동작 | 표준 접두사 | 설명 |
|------|------------|------|
| 등록 | add | 새 항목 등록 페이지 이동 |
| 저장 | save | 최종 완료/등록 액션 |
| 상세 | get | 단일 정보 조회 |
| 목록 | list | 목록 조회 |
| 수정 | update | 변경 저장 |
| 삭제 | delete | 삭제 |
| 탈퇴 | withdraw | 회원 탈퇴 |
| 취소/해지 | cancel | 취소/해지 |
| 참가 | join | 참가 |
| 확인 | check | 검증 |
| 찾기 | find | 찾기 |

---

### 2.1 src/api/partyApi.js

| 라인 | 현재 | 변경 |
|------|------|------|
| 6 | `createParty` | `addParty` |
| 10 | `getPartyList` | `listParties` |
| 18 | `getProducts` | `listProducts` |
| 30 | `leaveParty` | `withdrawParty` |
| 34 | `getMyParties` | `listMyParties` |
| 47 | `getPartyMembers` | `listPartyMembers` |

---

### 2.2 src/api/paymentApi.js

| 라인 | 현재 | 변경 |
|------|------|------|
| 3 | `getMyPayments` | `listMyPayments` |

---

### 2.3 src/api/depositApi.js

| 라인 | 현재 | 변경 |
|------|------|------|
| 3 | `getMyDeposits` | `listMyDeposits` |

---

### 2.4 src/api/settlementApi.js

| 라인 | 현재 | 변경 |
|------|------|------|
| 3 | `getMySettlements` | `listMySettlements` |
| 18 | `getSettlements` | `listSettlements` |

---

### 2.5 src/api/bankAccountApi.js

| 라인 | 현재 | 변경 |
|------|------|------|
| 9 | `requestVerification` | `checkVerification` |
| 28 | `verifyAndRegister` | `saveAccount` |
| 73 | `changeAccount` | `updateAccount` |

---

### 2.6 src/api/userApi.js

| 라인 | 현재 | 변경 |
|------|------|------|
| 8 | `getUserList` | `listUsers` |
| 19 | `updatePwd` | `updatePassword` |

---

### 2.7 src/api/authApi.js

| 라인 | 현재 | 변경 |
|------|------|------|
| 4 | `fetchCurrentUser` | `getUser` |
| 10 | `signup` | `addUser` |
| 12 | `verifyEmail` | `checkEmail` |
| 25 | `verifyPassAuth` | `checkPassAuth` |
| 34 | `setupOtp` | `addOtp` |
| 36 | `verifyOtp` | `checkOtp` |
| 39 | `disableOtp` | `cancelOtp` |

---

### 2.8 src/api/productApi.js

| 라인 | 현재 | 변경 |
|------|------|------|
| 6 | `getCategories` | `listCategories` |
| 22 | `createProduct` | `addProduct` |

---

### 2.9 src/api/adminUserApi.js

| 라인 | 현재 | 변경 |
|------|------|------|
| 3 | `fetchAdminUsers` | `listUsers` |

---

### 2.10 src/api/mainApi.js

| 라인 | 현재 | 변경 |
|------|------|------|
| 7 | `getMainPopularParties` | `listPopularParties` |

---

### 2.11 src/api/pushApi.js

| 라인 | 현재 | 변경 |
|------|------|------|
| 4 | `getMyPushList` | `listMyPush` |
| 22 | `deleteAllPushs` | `deleteAllPush` (오타 수정) |

---

### 2.12 src/hooks/party/partyService.js

| 라인 | 현재 | 변경 |
|------|------|------|
| 3 | `fetchPartyList` | `listParties` |
| 8 | `fetchPartyDetail` | `getPartyDetail` |
| 13 | `createParty` | `addParty` |
| 27 | `fetchMyParties` | `listMyParties` |
| 32 | `fetchPartyMembers` | `listPartyMembers` |
| 42 | `fetchProducts` | `listProducts` |

---

### 2.13 src/store/party/partyStore.js

| 라인 | 현재 | 변경 |
|------|------|------|
| 49 | `loadParties` | `listParties` |
| 98 | `loadMyParties` | `listMyParties` |
| 118 | `loadPartyDetail` | `getPartyDetail` |
| 142 | `loadProducts` | `listProducts` |
| 162 | `createNewParty` | `addParty` |
| 184 | `joinPartyAction` | `joinParty` |
| 209 | `leavePartyAction` | `withdrawParty` |

---

## 3. 수정 시 주의사항

### 3.1 API 메서드명 변경 시 영향받는 파일

메서드명을 변경하면 해당 메서드를 import/사용하는 모든 파일도 함께 수정해야 합니다.

**예시: `createParty` → `addParty` 변경 시**
```
영향받는 파일:
- src/api/partyApi.js (정의)
- src/hooks/party/partyService.js (import & 사용)
- src/store/party/partyStore.js (import)
- src/pages/party/PartyCreatePage.jsx (사용 가능성)
```

### 3.2 권장 수정 순서

1. API 파일 (src/api/*.js) 먼저 수정
2. Service/Hook 파일 수정
3. Store 파일 수정
4. Page/Component 파일 수정
5. 전체 빌드 테스트

### 3.3 검색 명령어

VSCode에서 영향받는 파일 찾기:
```
Ctrl+Shift+F → "createParty" 검색
```

---

## 4. 요약 통계

| 카테고리 | 수정 항목 수 |
|----------|-------------|
| 디버그 로그 삭제 | 9개 |
| console.log → error | 4개 |
| API 메서드명 변경 | 약 35개 |

---

## 5. 체크리스트

- [ ] 1.1 usePushNotification.js 디버그 로그 삭제
- [ ] 1.1 AddSubscriptionModal.jsx 디버그 로그 삭제
- [ ] 1.2 useOtp.js console.log → console.error
- [ ] 1.2 useResetPassword.js console.log → console.error
- [ ] 2.1 partyApi.js 메서드명 수정
- [ ] 2.2 paymentApi.js 메서드명 수정
- [ ] 2.3 depositApi.js 메서드명 수정
- [ ] 2.4 settlementApi.js 메서드명 수정
- [ ] 2.5 bankAccountApi.js 메서드명 수정
- [ ] 2.6 userApi.js 메서드명 수정
- [ ] 2.7 authApi.js 메서드명 수정
- [ ] 2.8 productApi.js 메서드명 수정
- [ ] 2.9 adminUserApi.js 메서드명 수정
- [ ] 2.10 mainApi.js 메서드명 수정
- [ ] 2.11 pushApi.js 메서드명 수정
- [ ] 2.12 partyService.js 메서드명 수정
- [ ] 2.13 partyStore.js 메서드명 수정
- [ ] 전체 빌드 테스트 (npm run build)
- [ ] 기능 테스트
