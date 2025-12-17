# 4beans-moa 테마 시스템 가이드

## 개요

2025-12-17 테마 시스템이 CSS 변수 기반으로 리팩토링되었습니다.

### 이전 방식 (Per-file theme objects)
```jsx
// 각 컴포넌트마다 테마 객체를 정의해야 했음
const themeStyles = {
  pop: { buttonBg: 'bg-pink-500', ... },
  classic: { buttonBg: 'bg-[#635bff]', ... },
  dark: { ... },
  christmas: { ... },
};

const { theme } = useThemeStore();
const themeStyle = themeStyles[theme] || themeStyles.pop;
```

### 새로운 방식 (CSS Variables)
```jsx
// CSS 변수를 직접 사용 - 테마 객체 불필요!
<button className="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)]">
  Click
</button>
```

---

## CSS 변수 목록

`src/assets/global.css`에 정의됨:

| 변수 | 설명 | Pop | Classic | Dark | Christmas |
|------|------|-----|---------|------|-----------|
| `--theme-primary` | 기본 액센트 | #ec4899 | #635bff | #635bff | #c41e3a |
| `--theme-primary-hover` | 호버 상태 | #db2777 | #5851e8 | #5851e8 | #a91b32 |
| `--theme-primary-light` | 연한 배경 | #fdf2f8 | #eef2ff | #1e1b4b | #fef2f2 |
| `--theme-secondary` | 보조 색상 | #06b6d4 | #00d4ff | #4fd1c5 | #1a5f2a |
| `--theme-bg` | 페이지 배경 | #f8fafc | #ffffff | #0B1120 | #fffbeb |
| `--theme-bg-card` | 카드 배경 | #ffffff | #ffffff | #1E293B | #ffffff |
| `--theme-text` | 기본 텍스트 | #0f172a | #111827 | #f8fafc | #1f2937 |
| `--theme-text-muted` | 보조 텍스트 | #64748b | #6b7280 | #94a3b8 | #6b7280 |
| `--theme-border` | 테두리 | #000000 | #e5e7eb | #334155 | #e5e7eb |
| `--theme-border-light` | 연한 테두리 | #e2e8f0 | #f3f4f6 | #475569 | #f3f4f6 |
| `--theme-shadow` | 그림자 | neo-brutal | soft | dark | soft |
| `--theme-shadow-hover` | 호버 그림자 | neo-brutal | soft | dark | soft |
| `--theme-focus-ring` | 포커스 링 | pink | indigo | indigo | red |
| `--theme-border-width` | 테두리 두께 | 2px | 1px | 1px | 1px |
| `--theme-radius` | 모서리 반경 | 0.75rem | 1rem | 1rem | 1rem |

---

## Tailwind 확장

`tailwind.config.js`에서 사용 가능한 테마 클래스:

```jsx
// Colors
bg-theme-primary
bg-theme-primary-hover
bg-theme-primary-light
bg-theme-secondary
bg-theme-bg
bg-theme-bg-card
text-theme-text
text-theme-text-muted
border-theme-border
border-theme-border-light

// Shadows
shadow-theme
shadow-theme-hover
shadow-theme-soft

// Border width & radius
border-theme
rounded-theme

// Ring
ring-theme
```

---

## 컴포넌트 마이그레이션 가이드

### Before (기존 방식)
```jsx
import { useThemeStore } from '@/store/themeStore';

const themeStyles = {
  pop: {
    buttonBg: 'bg-pink-500 hover:bg-pink-600',
    text: 'text-gray-900',
    border: 'border-gray-200',
  },
  classic: { ... },
  dark: { ... },
  christmas: { ... },
};

export default function MyComponent() {
  const { theme } = useThemeStore();
  const style = themeStyles[theme] || themeStyles.pop;

  return (
    <button className={style.buttonBg}>Click</button>
  );
}
```

### After (새로운 방식)
```jsx
// useThemeStore import 불필요 (christmas 체크용 제외)
export default function MyComponent() {
  return (
    <button className="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white">
      Click
    </button>
  );
}
```

---

## 공통 패턴

### 버튼
```jsx
// Primary Button
<button className="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white font-semibold rounded-[var(--theme-radius)] shadow-[var(--theme-shadow)] transition-all">
  Primary
</button>

// Secondary Button
<button className="bg-[var(--theme-bg-card)] hover:bg-[var(--theme-primary-light)] text-[var(--theme-text)] border border-[var(--theme-border-light)] rounded-[var(--theme-radius)]">
  Secondary
</button>
```

### 카드
```jsx
<div className="bg-[var(--theme-bg-card)] border border-[var(--theme-border-light)] rounded-[var(--theme-radius)] shadow-[var(--theme-shadow-soft)]">
  {/* content */}
</div>
```

### 입력 필드
```jsx
<input className="bg-[var(--theme-bg-card)] text-[var(--theme-text)] border border-[var(--theme-border-light)] rounded-lg focus:ring-2 focus:ring-[var(--theme-focus-ring)] focus:border-[var(--theme-primary)]" />
```

### 텍스트
```jsx
<h1 className="text-[var(--theme-text)]">제목</h1>
<p className="text-[var(--theme-text-muted)]">설명 텍스트</p>
<span className="text-[var(--theme-primary)]">강조 텍스트</span>
```

### 모달
```jsx
<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
  <div className="bg-[var(--theme-bg-card)] rounded-[var(--theme-radius)] shadow-[var(--theme-shadow-hover)] p-6">
    {/* content */}
  </div>
</div>
```

---

## 유틸리티 사용

`src/utils/themeUtils.js`에서 제공하는 헬퍼:

```jsx
import { themeClasses, cn } from '@/utils/themeUtils';

// 미리 정의된 클래스 조합 사용
<button className={themeClasses.button.primary}>Primary</button>
<div className={themeClasses.card.base}>Card</div>
<input className={themeClasses.input.base} />

// 클래스 결합
<div className={cn(themeClasses.card.base, 'p-6 my-4')}>
  Combined
</div>
```

---

## Christmas 테마 특별 처리

Christmas 테마에서 눈 내리는 배경이 필요한 경우:

```jsx
import { useThemeStore } from '@/store/themeStore';
import { ChristmasBackground } from '@/config/themeConfig';

export default function MyPage() {
  const { theme } = useThemeStore();

  return (
    <div>
      {theme === 'christmas' && <ChristmasBackground />}
      {/* content */}
    </div>
  );
}
```

---

## 마이그레이션 완료 파일

- [x] Footer.jsx
- [x] PasswordVerificationModal.jsx
- [x] AddSubscription.jsx

## 마이그레이션 필요 파일 (35개)

### Bank-verification (5개)
- [ ] BankSelectionStep.jsx
- [ ] CompletionStep.jsx
- [ ] ProcessingStep.jsx
- [ ] VerificationStep.jsx
- [ ] VirtualBankModal.jsx

### User pages (6개)
- [ ] FindIdForm.jsx
- [ ] FindIdResult.jsx
- [ ] ResetPwdForm.jsx
- [ ] ResetPwdGuide.jsx
- [ ] PageSteps.jsx
- [ ] PageTitle.jsx

### Admin pages (14개)
- [ ] SocialButton.jsx
- [ ] OutlineCard.jsx
- [ ] MenuButton.jsx
- [ ] AdminLoginHistoryCard.jsx
- [ ] UserListTableCard.jsx
- [ ] UserListHero.jsx
- [ ] StatusBadge.jsx
- [ ] AddBlacklistHero.jsx
- [ ] AddBlacklistFormCard.jsx
- [ ] RemoveBlacklistHero.jsx
- [ ] RemoveBlacklistFormCard.jsx
- [ ] AdminUserDetailHeader.jsx
- [ ] AdminUserDetailProfileCard.jsx
- [ ] AdminUserDetailLoginHistorySection.jsx

### Push components (8개)
- [ ] NotificationPopover.jsx
- [ ] AdminPushModal.jsx
- [ ] HistoryTab.jsx
- [ ] TemplatesTab.jsx
- [ ] NotificationItem.jsx
- [ ] UserSelectList.jsx
- [ ] SendPushForm.jsx
- [ ] TemplateForm.jsx

### Other (2개)
- [ ] AddSubscriptionModal.jsx
- [ ] NeoBackground.jsx

---

## 장점

1. **코드 중복 제거**: 각 파일에서 20-40줄의 테마 객체 제거
2. **일관성**: 모든 컴포넌트가 동일한 CSS 변수 사용
3. **유지보수 용이**: 테마 색상 변경 시 global.css 한 곳만 수정
4. **성능**: 런타임 계산 없이 CSS 네이티브 변수 사용
5. **개발자 경험**: 직관적인 변수명으로 빠른 개발

---

*작성일: 2025-12-17*
*작성자: Claude Code*
