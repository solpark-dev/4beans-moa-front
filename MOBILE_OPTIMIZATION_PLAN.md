# 전체 모바일 최적화 계획

## 개요

모든 페이지와 모든 테마에서 모바일 성능 최적화를 적용합니다.

### 최적화 원칙
1. **모바일 감지**: `useIsMobile` 훅 사용 (breakpoint: 768px)
2. **Framer Motion 조건부 비활성화**: `whileHover`, `whileTap`, `repeat: Infinity` 모바일에서 제거
3. **CSS 폴백**: 복잡한 애니메이션은 CSS @keyframes로 대체
4. **요소 수 감소**: 눈송이, 파티클 등 모바일에서 개수 줄임
5. **blur 효과 제거**: 모바일에서 성능 저하 원인

---

## 진행 상태

### 완료됨
- [x] MainPage.jsx + 모든 섹션 (MainHeroSection, MainMarqueeSection, MainStatsMarquee, MainFeaturesSection, MainHowItWorksSection, MainTrendingSection, MainProductsSection, MainStatementSection, MainComparisonSection)
- [x] ChristmasBackground (themeConfig.jsx) - 80개 → 12개 눈송이
- [x] NeoBackground.jsx - 그라디언트 orbs 정적화
- [x] SnowPlow.jsx - 모든 크리스마스 이펙트 최적화
- [x] **Phase 1 완료됨**:
  - [x] PartyListPage.jsx
  - [x] PartyDetailPage.jsx
  - [x] PartyCreatePage.jsx
  - [x] MyPartyListPage.jsx
  - [x] MyWalletPage.jsx
  - [x] MyPage.jsx (mypage 폴더)
  - [x] LoginPage.jsx (login 폴더)
  - [x] LandingPageT.jsx (이미 최적화됨)

---

## Phase 1: 핵심 사용자 페이지 (우선순위 높음)

### 1.1 파티 관련 페이지
| 파일 | 예상 작업 | 복잡도 |
|------|----------|--------|
| `PartyListPage.jsx` | useIsMobile 훅, 카드 hover 비활성화, 스크롤 애니메이션 최적화 | 높음 |
| `PartyDetailPage.jsx` | 히어로 애니메이션, 멤버 카드 hover | 중간 |
| `PartyCreatePage.jsx` | 스텝 전환 애니메이션, 폼 인터랙션 | 중간 |
| `MyPartyListPage.jsx` | 카드 그리드 hover 효과 | 낮음 |

### 1.2 사용자 페이지
| 파일 | 예상 작업 | 복잡도 |
|------|----------|--------|
| `MyWalletPage.jsx` | 3D 카드 효과, 금융 카드 hover | 높음 |
| `MyPage.jsx` | 프로필 카드 애니메이션 | 낮음 |
| `LoginPage.jsx` | 폼 애니메이션 | 낮음 |

### 1.3 랜딩 페이지
| 파일 | 예상 작업 | 복잡도 |
|------|----------|--------|
| `LandingPageT.jsx` | 스크롤 transform, gradient orbs, stagger 애니메이션 | 높음 |

---

## Phase 2: 관리자/결제 페이지 (우선순위 중간)

| 파일 | 예상 작업 | 복잡도 |
|------|----------|--------|
| `AdminDashboardPage.jsx` | 차트 애니메이션, KPI 카드 hover | 중간 |
| `AdminUserListPage.jsx` | 테이블 row hover | 낮음 |
| `BillingRegisterPage.jsx` | 카드 선택 애니메이션 | 낮음 |
| `PaymentSuccessPage.jsx` | 성공 애니메이션 | 낮음 |
| `SettlementHistoryPage.jsx` | 테이블/리스트 | 낮음 |
| `FinancialHistoryPage.jsx` | 테이블/리스트 | 낮음 |

---

## Phase 3: 기타 페이지 (우선순위 낮음)

| 파일 | 예상 작업 | 복잡도 |
|------|----------|--------|
| `AddUserPage.jsx` | 폼 애니메이션 | 낮음 |
| `DeleteUserPage.jsx` | 확인 모달 | 낮음 |
| `FindIdPage.jsx` | 폼 | 낮음 |
| `ResetPwdPage.jsx` | 폼 | 낮음 |
| `UpdatePwdPage.jsx` | 폼 | 낮음 |
| `UpdateUserPage.jsx` | 프로필 폼 | 낮음 |
| `BankVerificationPage.jsx` | 인증 폼 | 낮음 |
| `OAuthCallbackPage.jsx` | 로딩만 | 매우 낮음 |
| `PhoneConnectPage.jsx` | 폼 | 낮음 |
| `SocialRegisterPage.jsx` | 폼 | 낮음 |
| `EmailVerifiedPage.jsx` | 정적 | 매우 낮음 |

---

## Phase 4: 테마별 컴포넌트

### 공통 컴포넌트 (이미 완료)
- [x] `themeConfig.jsx` - ChristmasBackground
- [x] `NeoBackground.jsx` - 모든 테마 배경
- [x] `SnowPlow.jsx` - 크리스마스 이펙트

### 추가 확인 필요
| 컴포넌트 | 위치 | 테마 |
|----------|------|------|
| ThemeSwitcher | themeConfig.jsx | 모든 테마 |
| ThemeMarquee | themeConfig.jsx | pop 테마 |
| Header 컴포넌트 | components/common | 모든 테마 |
| Footer 컴포넌트 | components/common | 모든 테마 |

---

## 구현 패턴

### useIsMobile 훅 (표준 패턴)
```jsx
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= breakpoint);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);
  return isMobile;
};
```

### Framer Motion 조건부 비활성화
```jsx
// Before
<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>

// After
<motion.div
  whileHover={isMobile ? undefined : { scale: 1.05 }}
  whileTap={isMobile ? undefined : { scale: 0.98 }}
>
```

### 무한 애니메이션 처리
```jsx
// Before
transition={{ duration: 8, repeat: Infinity }}

// After (모바일은 정적)
{isMobile ? (
  <div style={{ opacity: 0.6 }} />
) : (
  <motion.div animate={{ ... }} transition={{ repeat: Infinity }} />
)}
```

### CSS 애니메이션 폴백
```jsx
{isMobile ? (
  <>
    <style>{`
      @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      .float-css { animation: float 3s ease-in-out infinite; }
    `}</style>
    <div className="float-css">...</div>
  </>
) : (
  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity }}>...</motion.div>
)}
```

---

## 예상 작업량

| Phase | 파일 수 | 복잡도 | 예상 시간 |
|-------|---------|--------|----------|
| 긴급 수정 | 1 | 낮음 | 즉시 |
| Phase 1 | 7 | 높음 | - |
| Phase 2 | 6 | 중간 | - |
| Phase 3 | 11 | 낮음 | - |
| Phase 4 | 3-5 | 중간 | - |
| **총계** | **~28** | - | - |

---

## 테스트 체크리스트

### 모바일 테스트 (Chrome DevTools)
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13 (390px)
- [ ] Galaxy S21 (360px)
- [ ] iPad Mini (768px - breakpoint)

### 기능 테스트
- [ ] 터치 이벤트 정상 동작
- [ ] 스크롤 부드러움
- [ ] 카드 클릭/탭 반응
- [ ] 페이지 전환 애니메이션
- [ ] 테마 전환 시 성능

### 성능 테스트
- [ ] Lighthouse Mobile Score > 80
- [ ] FPS > 30 (스크롤 시)
- [ ] 메모리 사용량 안정적

---

## 진행 순서 제안

1. **즉시**: MainTrendingSection 파티 카드 깨짐 수정
2. **Phase 1-A**: PartyListPage.jsx, PartyDetailPage.jsx (파티 핵심)
3. **Phase 1-B**: MyWalletPage.jsx, LandingPageT.jsx (애니메이션 많음)
4. **Phase 1-C**: 나머지 사용자 페이지
5. **Phase 2**: 관리자/결제 페이지
6. **Phase 3**: 기타 페이지
7. **Phase 4**: 테마 컴포넌트 추가 확인

---

*이 문서는 작업 진행에 따라 업데이트됩니다.*
