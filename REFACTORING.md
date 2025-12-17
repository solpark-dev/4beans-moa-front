# 리팩토링 계획서

> 작성일: 2025-12-17
> 프로젝트: 4beans-moa-front
> 우선순위: HIGH → MEDIUM → LOW

---

## 목차

1. [이슈 1: 스토어 간 순환 참조 위험](#이슈-1-스토어-간-순환-참조-위험)
2. [이슈 2: Loading/Error 상태 과도한 분리](#이슈-2-loadingerror-상태-과도한-분리)
3. [이슈 3: persist 미들웨어 미활용](#이슈-3-persist-미들웨어-미활용)
4. [구현 순서 및 체크리스트](#구현-순서-및-체크리스트)

---

## 이슈 1: 스토어 간 순환 참조 위험

### 우선순위: HIGH

### 현재 문제

`authStore.js`에서 다른 스토어를 직접 import하여 호출하고 있음.

```javascript
// src/store/authStore.js

// Line 4-5: 직접 import
import { useLoginStore } from "./user/loginStore";
import { useOtpStore } from "./user/otpStore";

// Line 28-29: purgeLoginPasswords()에서 직접 호출
useLoginStore.getState().setField("password", "");
useLoginStore.getState().setField("otpCode", "");

// Line 80: fetchSession()에서 직접 호출
useOtpStore.getState().setEnabled(!!res.data.otpEnabled);
```

### 문제점

1. **순환 참조 위험**: loginStore나 otpStore가 authStore를 import하면 즉시 에러
2. **강한 결합**: authStore가 다른 스토어의 내부 구현에 의존
3. **테스트 어려움**: 스토어 단위 테스트 시 mock 처리 복잡
4. **확장성 저하**: 새 스토어 추가 시 authStore 수정 필요

### 해결 방안: 이벤트 기반 통신 (Event Bus)

#### 1단계: 이벤트 유틸 생성

```javascript
// src/utils/storeEvents.js (새 파일)

/**
 * 스토어 간 이벤트 통신을 위한 유틸리티
 * CustomEvent API를 사용하여 스토어 간 디커플링
 */

export const StoreEvents = {
    // Auth 관련 이벤트
    AUTH_LOGOUT: 'store:auth:logout',
    AUTH_SESSION_LOADED: 'store:auth:sessionLoaded',

    // 필요 시 추가
    // USER_UPDATED: 'store:user:updated',
    // PARTY_JOINED: 'store:party:joined',
};

/**
 * 이벤트 발송
 * @param {string} eventName - 이벤트 이름 (StoreEvents 상수 사용)
 * @param {any} data - 전달할 데이터
 */
export const emitStoreEvent = (eventName, data = null) => {
    window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
};

/**
 * 이벤트 구독
 * @param {string} eventName - 이벤트 이름
 * @param {function} handler - 이벤트 핸들러
 * @returns {function} 구독 해제 함수
 */
export const onStoreEvent = (eventName, handler) => {
    const wrappedHandler = (e) => handler(e.detail);
    window.addEventListener(eventName, wrappedHandler);
    return () => window.removeEventListener(eventName, wrappedHandler);
};

/**
 * 여러 이벤트 한번에 구독
 * @param {Object} eventHandlers - { eventName: handler } 형태
 * @returns {function} 모든 구독 해제 함수
 */
export const onStoreEvents = (eventHandlers) => {
    const unsubscribes = Object.entries(eventHandlers).map(
        ([eventName, handler]) => onStoreEvent(eventName, handler)
    );
    return () => unsubscribes.forEach(unsub => unsub());
};
```

#### 2단계: authStore.js 수정

```javascript
// src/store/authStore.js (수정)

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import httpClient from "@/api/httpClient";
import { emitStoreEvent, StoreEvents } from "@/utils/storeEvents";

// ❌ 제거: import { useLoginStore } from "./user/loginStore";
// ❌ 제거: import { useOtpStore } from "./user/otpStore";

const PASSWORD_STORAGE_KEYS = [
    "login-password",
    "password",
    "pwd",
    "user-password",
    "pwd-remember",
];

export const purgeLoginPasswords = () => {
    [localStorage, sessionStorage].forEach((storage) => {
        if (!storage) return;
        PASSWORD_STORAGE_KEYS.forEach((key) => {
            try {
                storage.removeItem(key);
            } catch {
                // ignore
            }
        });
    });

    // ✅ 변경: 직접 호출 대신 이벤트 발송
    emitStoreEvent(StoreEvents.AUTH_LOGOUT);
};

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            accessTokenExpiresIn: null,
            loading: false,

            setTokens: ({ accessToken, refreshToken, accessTokenExpiresIn }) => {
                set({
                    accessToken,
                    refreshToken,
                    accessTokenExpiresIn: Number(accessTokenExpiresIn),
                });
                get().fetchSession();
            },

            setUser: (user) => set({ user }),

            clearAuth: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    accessTokenExpiresIn: null,
                    loading: false,
                });
                localStorage.removeItem("auth-storage");
            },

            fetchSession: async () => {
                const { clearAuth, accessToken } = get();

                if (!accessToken) {
                    clearAuth();
                    return;
                }

                set({ loading: true });

                try {
                    const res = await httpClient.get("/users/me");

                    if (res?.success && res.data) {
                        set({ user: res.data });

                        // ✅ 변경: 직접 호출 대신 이벤트 발송
                        emitStoreEvent(StoreEvents.AUTH_SESSION_LOADED, {
                            otpEnabled: !!res.data.otpEnabled,
                            user: res.data,
                        });
                    } else {
                        clearAuth();
                    }
                } catch (error) {
                    const status = error?.response?.status;
                    if (status !== 401) {
                        console.error("Session Fetch Error:", error);
                    }
                    clearAuth();
                } finally {
                    set({ loading: false });
                }
            },

            logout: async () => {
                try {
                    await httpClient.post("/auth/logout");
                } catch (error) {
                    console.error("Logout Error:", error);
                } finally {
                    purgeLoginPasswords();
                    get().clearAuth();
                }
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                accessTokenExpiresIn: state.accessTokenExpiresIn,
            }),
        }
    )
);
```

#### 3단계: loginStore.js 수정

```javascript
// src/store/user/loginStore.js (수정)

import { create } from "zustand";
import { onStoreEvent, StoreEvents } from "@/utils/storeEvents";

export const useLoginStore = create((set) => ({
    email: "",
    password: "",
    remember: false,
    otpRequired: false,
    otpModalOpen: false,
    otpCode: "",
    otpToken: null,

    setField: (key, value) => set({ [key]: value }),

    resetOtp: () =>
        set({
            otpRequired: false,
            otpModalOpen: false,
            otpCode: "",
            otpToken: null,
        }),

    // ✅ 추가: 민감 정보 초기화
    clearSensitiveData: () =>
        set({
            password: "",
            otpCode: "",
        }),
}));

// ✅ 추가: 이벤트 구독 (스토어 생성 후 실행)
onStoreEvent(StoreEvents.AUTH_LOGOUT, () => {
    useLoginStore.getState().clearSensitiveData();
});
```

#### 4단계: otpStore.js 수정

```javascript
// src/store/user/otpStore.js (수정)

import { create } from "zustand";
import { onStoreEvent, StoreEvents } from "@/utils/storeEvents";

export const useOtpStore = create((set) => ({
    enabled: false,
    modalOpen: false,
    qrUrl: null,
    secret: null,
    code: "",
    loading: false,
    mode: "enable",

    setEnabled: (enabled) => set({ enabled }),

    setModal: (open) =>
        set({
            modalOpen: open,
            ...(open ? { code: "" } : {}),
        }),

    setField: (field, value) => set({ [field]: value }),

    reset: (options = {}) =>
        set((state) => ({
            enabled: options.resetEnabled ? false : state.enabled,
            modalOpen: false,
            qrUrl: null,
            secret: null,
            code: "",
            loading: false,
            mode: "enable",
        })),
}));

// ✅ 추가: 이벤트 구독
onStoreEvent(StoreEvents.AUTH_SESSION_LOADED, (data) => {
    if (data?.otpEnabled !== undefined) {
        useOtpStore.getState().setEnabled(data.otpEnabled);
    }
});
```

### 변경 후 구조

```
┌─────────────────────────────────────────────────────────────┐
│                      storeEvents.js                         │
│                    (이벤트 버스 역할)                         │
└─────────────────────────────────────────────────────────────┘
        ▲                    ▲                    ▲
        │ emit               │ emit               │ subscribe
        │                    │                    │
┌───────┴───────┐    ┌───────┴───────┐    ┌──────┴────────┐
│   authStore   │    │  loginStore   │    │   otpStore    │
│               │    │  (구독)        │    │  (구독)        │
└───────────────┘    └───────────────┘    └───────────────┘

- 직접 import 없음
- 순환 참조 불가능
- 각 스토어 독립적 테스트 가능
```

### 테스트 체크리스트

- [ ] 로그인 후 OTP 상태 정상 반영
- [ ] 로그아웃 시 비밀번호/OTP 코드 초기화
- [ ] 페이지 새로고침 후 세션 복원
- [ ] loginStore만 import해도 에러 없음
- [ ] otpStore만 import해도 에러 없음

---

## 이슈 2: Loading/Error 상태 과도한 분리

### 우선순위: MEDIUM

### 현재 문제

대형 스토어에서 액션별로 loading/error 상태가 세분화되어 보일러플레이트 코드 증가.

| 스토어 | loading 상태 | error 상태 | 총 상태 수 |
|--------|-------------|-----------|-----------|
| partyStore | 7개 | 7개 | 14개 |
| walletStore | 6개 | 6개 | 12개 |
| paymentStore | 3개 | 3개 | 6개 |

```javascript
// 현재 패턴 - 반복되는 보일러플레이트
loadParties: async () => {
    set((state) => ({
        loading: { ...state.loading, parties: true },
        error: { ...state.error, parties: null }
    }));
    try {
        // ...
    } catch (error) {
        set((state) => ({
            error: { ...state.error, parties: error.message }
        }));
    } finally {
        set((state) => ({
            loading: { ...state.loading, parties: false }
        }));
    }
}
```

### 문제점

1. **보일러플레이트 과다**: 액션마다 동일한 패턴 반복 (8-12줄)
2. **스프레드 연산 비용**: 매번 loading/error 객체 전체 복사
3. **reset 함수 복잡**: 모든 상태를 나열해야 함
4. **타입 안전성 부족**: 키 오타 시 런타임에서야 발견

### 해결 방안

#### 방안 A: 단일 actionState로 통합 (단순한 스토어용)

```javascript
// 적용 대상: paymentStore, depositStore, settlementStore

const usePaymentStore = create((set, get) => ({
    payments: [],
    selectedPayment: null,

    // 단일 액션 상태
    actionState: {
        type: null,      // 'list' | 'detail' | 'retry'
        loading: false,
        error: null,
    },

    // 헬퍼 함수
    startAction: (type) => set({
        actionState: { type, loading: true, error: null }
    }),

    endAction: (error = null) => set((state) => ({
        actionState: { ...state.actionState, loading: false, error }
    })),

    loadPayments: async () => {
        get().startAction('list');
        try {
            const data = await getMyPayments();
            set({ payments: data });
            get().endAction();
        } catch (error) {
            get().endAction(error.message);
        }
    },

    // 컴포넌트에서 사용
    // const isLoading = actionState.type === 'list' && actionState.loading;
}));
```

#### 방안 B: 커스텀 미들웨어 (복잡한 스토어용)

```javascript
// src/utils/createAsyncAction.js (새 파일)

/**
 * 비동기 액션 생성 헬퍼
 * loading/error 상태 관리 자동화
 */
export const createAsyncAction = (set, get) => (actionName, asyncFn) => {
    return async (...args) => {
        // 시작: loading = true, error = null
        set((state) => ({
            loading: { ...state.loading, [actionName]: true },
            error: { ...state.error, [actionName]: null }
        }));

        try {
            const result = await asyncFn(get, set, ...args);
            return result;
        } catch (error) {
            const errorMessage = error.message || '오류가 발생했습니다.';
            set((state) => ({
                error: { ...state.error, [actionName]: errorMessage }
            }));
            throw error;
        } finally {
            // 종료: loading = false
            set((state) => ({
                loading: { ...state.loading, [actionName]: false }
            }));
        }
    };
};

/**
 * 초기 상태 생성 헬퍼
 */
export const createInitialAsyncState = (actionNames) => ({
    loading: Object.fromEntries(actionNames.map(name => [name, false])),
    error: Object.fromEntries(actionNames.map(name => [name, null])),
});
```

```javascript
// 적용 대상: partyStore, walletStore

import { createAsyncAction, createInitialAsyncState } from '@/utils/createAsyncAction';

const PARTY_ACTIONS = ['parties', 'myParties', 'detail', 'create', 'join', 'leave', 'products'];

const usePartyStore = create((set, get) => {
    const asyncAction = createAsyncAction(set, get);

    return {
        parties: [],
        myParties: [],
        currentParty: null,
        products: [],

        // 초기 상태 자동 생성
        ...createInitialAsyncState(PARTY_ACTIONS),

        // 간결해진 액션 정의
        loadParties: asyncAction('parties', async (get, set, params) => {
            const data = await fetchPartyList(params);
            set({ parties: data });
        }),

        loadMyParties: asyncAction('myParties', async (get, set) => {
            const data = await fetchMyParties();
            set({ myParties: data || [] });
        }),

        createNewParty: asyncAction('create', async (get, set, partyData) => {
            return await createParty(partyData);
        }),

        // ... 기타 액션
    };
});
```

#### 방안 C: React Query 도입 (장기적)

```javascript
// 서버 상태는 React Query로 분리
// src/hooks/queries/useParties.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPartyList, createParty } from '@/hooks/party/partyService';

export const partyKeys = {
    all: ['parties'],
    lists: () => [...partyKeys.all, 'list'],
    list: (params) => [...partyKeys.lists(), params],
    details: () => [...partyKeys.all, 'detail'],
    detail: (id) => [...partyKeys.details(), id],
};

export const useParties = (params) => {
    return useQuery({
        queryKey: partyKeys.list(params),
        queryFn: () => fetchPartyList(params),
        staleTime: 5 * 60 * 1000, // 5분
    });
};

export const useCreateParty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createParty,
        onSuccess: () => {
            queryClient.invalidateQueries(partyKeys.lists());
        },
    });
};

// 컴포넌트에서 사용
function PartyList() {
    const { data, isLoading, error } = useParties({ sort: 'latest' });
    const createMutation = useCreateParty();

    // loading, error 자동 관리
    // 캐싱, 리페치, 낙관적 업데이트 등 고급 기능 제공
}
```

### 적용 전략

| 단계 | 대상 | 방안 | 예상 효과 |
|-----|------|------|----------|
| 1단계 | paymentStore, depositStore | 방안 A | 상태 수 50% 감소 |
| 2단계 | partyStore, walletStore | 방안 B | 보일러플레이트 70% 감소 |
| 3단계 (선택) | 서버 상태 전체 | 방안 C | 캐싱, 자동 리페치 |

### 테스트 체크리스트

- [ ] 각 액션별 로딩 상태 정상 표시
- [ ] 에러 발생 시 적절한 메시지 표시
- [ ] 동시 요청 시 상태 충돌 없음
- [ ] reset 함수 정상 작동

---

## 이슈 3: persist 미들웨어 미활용

### 우선순위: LOW

### 현재 상황

- `authStore`: persist 사용 중 ✅
- `themeStore`: persist 사용 중 ✅
- 기타 스토어: persist 미사용

### 개선 대상

| 스토어 | persist 필요성 | 이유 |
|--------|---------------|------|
| partyStore.products | MEDIUM | OTT 상품 목록 캐싱 |
| walletStore.account/card | LOW | 계좌/카드 정보 캐싱 |
| chatBotStore | LOW | 대화 히스토리 유지 |

### 구현 예시

```javascript
// partyStore.js - 상품 목록만 persist
import { persist, createJSONStorage } from 'zustand/middleware';

const usePartyStore = create(
    persist(
        (set, get) => ({
            // ... 기존 상태
        }),
        {
            name: 'party-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                products: state.products, // 상품 목록만 저장
            }),
            version: 1, // 스키마 버전 관리
        }
    )
);
```

---

## 구현 순서 및 체크리스트

### Phase 1: 스토어 디커플링 (이슈 1)

예상 소요: 1-2시간

- [ ] `src/utils/storeEvents.js` 생성
- [ ] `authStore.js` 수정 (import 제거, 이벤트 발송)
- [ ] `loginStore.js` 수정 (이벤트 구독)
- [ ] `otpStore.js` 수정 (이벤트 구독)
- [ ] 로그인/로그아웃 플로우 테스트
- [ ] 페이지 새로고침 테스트

### Phase 2: 로딩 상태 최적화 (이슈 2)

예상 소요: 2-3시간

- [ ] `src/utils/createAsyncAction.js` 생성
- [ ] `paymentStore.js` 리팩토링 (방안 A)
- [ ] `partyStore.js` 리팩토링 (방안 B)
- [ ] `walletStore.js` 리팩토링 (방안 B)
- [ ] 각 페이지 로딩/에러 상태 테스트

### Phase 3: persist 확대 (이슈 3)

예상 소요: 30분

- [ ] `partyStore` products persist 추가
- [ ] 캐시 무효화 로직 확인
- [ ] localStorage 용량 모니터링

---

## 참고 자료

- [Zustand 공식 문서](https://docs.pmnd.rs/zustand)
- [Zustand persist 미들웨어](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
- [TanStack Query](https://tanstack.com/query/latest)
- [Event-driven architecture in frontend](https://blog.logrocket.com/event-driven-state-management-in-react/)

---

## 변경 이력

| 날짜 | 버전 | 내용 |
|-----|------|------|
| 2025-12-17 | 1.0 | 최초 작성 |
