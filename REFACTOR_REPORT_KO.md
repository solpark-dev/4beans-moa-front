# 리팩토링 보고서: 파티 페이지 유지보수성 개선

## 1. 개요
본 리팩토링 작업은 `PartyListPage`, `PartyDetailPage`, `PartyCreatePage` 등 파티 관련 페이지들에서 반복되는 코드를 제거하고, 테마 관련 로직을 중앙에서 관리하여 유지보수성을 향상시키는 것을 목표로 수행되었습니다.

## 2. 주요 변경 사항

### 2.1 테마 설정 중앙화 및 강화
*   **파일:** `src/config/themeConfig.jsx`
*   **변경 내용:**
    *   기존에 각 페이지 파일 내부에 하드코딩되어 있던 `partyThemeStyles` 객체를 제거했습니다.
    *   `themeConfig`에 `hoverAccentBg`, `badge`, `buttonShadow`, `greenAccent`, `greenBadge` 등 페이지에서 사용하던 구체적인 스타일 속성들을 추가했습니다.
    *   이를 통해 테마 스타일 변경 시 개별 페이지가 아닌 설정 파일 하나만 수정하면 되도록 개선했습니다.

### 2.2 공통 유틸리티 함수 분리
*   **파일:** `src/utils/partyUtils.js` (신규 생성)
*   **변경 내용:**
    *   각 페이지에서 중복 정의되어 사용되던 `getStatusBadge`(파티 상태에 따른 뱃지 스타일 반환)와 `formatDate`(날짜 형식 변환) 함수를 별도 유틸리티 파일로 추출했습니다.
    *   이제 모든 파티 관련 페이지가 동일한 로직을 공유합니다.

### 2.3 페이지 코드 리팩토링
*   **대상 파일:**
    *   `src/pages/party/PartyListPage.jsx`
    *   `src/pages/party/PartyDetailPage.jsx`
    *   `src/pages/party/PartyCreatePage.jsx`
*   **변경 내용:**
    *   내부 `partyThemeStyles` 정의를 제거하고, `useTheme` 훅을 통해 가져온 `currentTheme` 객체를 직접 사용하도록 변경했습니다.
    *   복잡하고 반복적인 삼항 연산자(예: `theme === 'pop' ? ... : theme === 'christmas' ? ...`)를 `currentTheme.accentBg`와 같은 속성 참조로 대체하여 가독성을 크게 높였습니다.
    *   `../../utils/partyUtils`에서 공통 함수를 import하여 사용하도록 수정했습니다.

### 2.4 빌드 안정성 개선
*   **변경 내용:**
    *   `PartyCreatePage.jsx` 내 중복 import(`getProductIconUrl`) 문제를 수정했습니다.
    *   `src/components/community` 폴더 내 컴포넌트들의 파일명 대소문자 불일치(`Communitylayout.jsx` -> `CommunityLayout.jsx` 등)로 인한 빌드 오류를 수정했습니다.

## 3. 기대 효과
*   **코드 중복 감소:** 동일한 로직과 스타일 정의가 여러 파일에 흩어져 있던 것을 제거하여 코드 양을 줄였습니다.
*   **유지보수성 향상:** 테마 스타일이나 뱃지 로직 변경 시 한 곳만 수정하면 모든 페이지에 반영되므로 유지보수가 용이해졌습니다.
*   **가독성 개선:** 조건부 렌더링 로직이 단순화되어 코드 흐름을 파악하기 쉬워졌습니다.
