# 4beans-moa 기술 문서

## 목차

1. [시스템 아키텍처](#1-시스템-아키텍처)
2. [기술 스택](#2-기술-스택)
3. [API 명세](#3-api-명세)
4. [데이터베이스 설계](#4-데이터베이스-설계)
5. [핵심 기능 구현](#5-핵심-기능-구현)
   - 5.1 인증 플로우
   - 5.2 결제 시스템
   - 5.3 정산 시스템
   - 5.4 보증금 시스템
   - 5.5 예외 처리 시스템
6. [배포 구성](#6-배포-구성)
7. [개발 환경 설정](#7-개발-환경-설정)

---

## 1. 시스템 아키텍처

### 1.1 전체 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    React SPA (Vite)                      │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────────────┐   │   │
│  │  │  Zustand  │  │  Axios    │  │  React Router     │   │   │
│  │  │  (State)  │  │  (HTTP)   │  │  (Navigation)     │   │   │
│  │  └───────────┘  └───────────┘  └───────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS / REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Server Layer                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │               Spring Boot Application                    │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────────────┐   │   │
│  │  │Controller │→ │  Service  │→ │     MyBatis       │   │   │
│  │  │  (REST)   │  │  (Logic)  │  │    (Mapper)       │   │   │
│  │  └───────────┘  └───────────┘  └───────────────────┘   │   │
│  │                                                          │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────────────┐   │   │
│  │  │   JWT     │  │ Scheduler │  │   WebClient       │   │   │
│  │  │  (Auth)   │  │  (Batch)  │  │ (External API)    │   │   │
│  │  └───────────┘  └───────────┘  └───────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐     │
│  │   MySQL     │  │    Redis    │  │        S3           │     │
│  │   (RDS)     │  │   (Cache)   │  │    (Storage)        │     │
│  └─────────────┘  └─────────────┘  └─────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     External Services                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐     │
│  │    Toss     │  │   Kakao     │  │      Google         │     │
│  │  Payments   │  │   OAuth     │  │      OAuth          │     │
│  └─────────────┘  └─────────────┘  └─────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 프론트엔드 아키텍처

```
src/
├── api/                    # API 통신 모듈
│   ├── httpClient.js       # Axios 인스턴스 + 인터셉터
│   ├── authApi.js          # 인증 API
│   ├── partyApi.js         # 파티 API
│   ├── paymentApi.js       # 결제 API
│   └── ...
├── components/             # 재사용 컴포넌트
│   ├── common/             # 공통 (Header, Footer)
│   └── ui/                 # shadcn/ui 컴포넌트
├── hooks/                  # 커스텀 훅
├── pages/                  # 페이지 컴포넌트
│   ├── main/
│   ├── party/
│   ├── user/
│   └── admin/
├── store/                  # Zustand 스토어
│   └── authStore.js        # 인증 상태 관리
├── routes/                 # 라우팅 설정
└── lib/                    # 유틸리티
```

### 1.3 백엔드 아키텍처

```
src/main/java/com/project/moa/
├── controller/             # REST API 엔드포인트
│   ├── AuthController.java
│   ├── PartyController.java
│   ├── PaymentController.java
│   └── ...
├── service/                # 비즈니스 로직
│   ├── AuthService.java
│   ├── PartyService.java
│   └── ...
├── mapper/                 # MyBatis 매퍼 인터페이스
├── dto/                    # 데이터 전송 객체
├── domain/                 # 도메인 엔티티
├── config/                 # 설정 클래스
│   ├── SecurityConfig.java
│   └── WebConfig.java
├── security/               # 보안 관련
│   ├── JwtTokenProvider.java
│   └── JwtAuthenticationFilter.java
└── scheduler/              # 스케줄러 (정산, 결제)
```

---

## 2. 기술 스택

### 2.1 프론트엔드

| 분류 | 기술 | 버전 | 용도 |
|------|------|------|------|
| **Framework** | React | 19.x | UI 라이브러리 |
| **Build Tool** | Vite | 7.x | 번들러 + 개발 서버 |
| **상태 관리** | Zustand | 5.x | 전역 상태 관리 |
| **HTTP Client** | Axios | 1.x | API 통신 |
| **Routing** | React Router | 7.x | SPA 라우팅 |
| **Styling** | Tailwind CSS | 4.x | 유틸리티 CSS |
| **UI Components** | shadcn/ui | - | Radix 기반 컴포넌트 |
| **Animation** | Framer Motion | 12.x | 애니메이션 |
| **Icons** | Lucide React | - | 아이콘 |
| **Charts** | Recharts | - | 차트 (관리자) |

### 2.2 백엔드

| 분류 | 기술 | 버전 | 용도 |
|------|------|------|------|
| **Framework** | Spring Boot | 3.5.5 | 웹 프레임워크 |
| **Language** | Java | 17 | 개발 언어 |
| **ORM** | MyBatis | 3.x | SQL 매퍼 |
| **Security** | Spring Security | 6.x | 인증/인가 |
| **JWT** | jjwt | 0.12.x | 토큰 생성/검증 |
| **Validation** | Bean Validation | - | 입력 검증 |
| **API Docs** | SpringDoc | 2.x | Swagger UI |

### 2.3 데이터베이스

| 분류 | 기술 | 버전 | 용도 |
|------|------|------|------|
| **RDBMS** | MySQL | 8.x | 주 데이터베이스 |
| **Cache** | Redis | 7.x | 세션/캐시 (선택) |

### 2.4 인프라 (AWS)

| 서비스 | 용도 |
|--------|------|
| **EC2** | 애플리케이션 서버 |
| **RDS** | MySQL 데이터베이스 |
| **S3** | 정적 파일 저장 (프로필 이미지) |
| **Route 53** | DNS 관리 |
| **ACM** | SSL 인증서 |
| **ALB** | 로드 밸런서 |

### 2.5 외부 서비스

| 서비스 | 용도 |
|--------|------|
| **Toss Payments** | 결제 처리 (빌링키 자동결제) |
| **Kakao OAuth** | 소셜 로그인 |
| **Google OAuth** | 소셜 로그인 |
| **Google OTP** | 2차 인증 |

---

## 3. API 명세

### 3.1 공통 사항

#### Base URL
```
Production: https://api.moamoa.cloud/api
Development: http://localhost:8080/api
```

#### 응답 형식
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

#### 에러 응답
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지"
  }
}
```

#### 인증 헤더
```
Authorization: Bearer {accessToken}
```

---

### 3.2 인증 API

#### 로그인
```http
POST /api/auth/login
Content-Type: application/json

Request:
{
  "userId": "string",
  "password": "string"
}

Response (200):
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "accessTokenExpiresIn": 3600000,
    "user": {
      "userId": "string",
      "nickname": "string",
      "role": "USER"
    }
  }
}
```

#### 토큰 갱신
```http
POST /api/auth/refresh
Headers:
  Refresh-Token: {refreshToken}

Response (200):
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "accessTokenExpiresIn": 3600000
  }
}
```

#### 로그아웃
```http
POST /api/auth/logout
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": null
}
```

#### 이메일 인증
```http
POST /api/auth/verify-email?token={token}

Response (200):
{
  "success": true,
  "data": {
    "message": "이메일 인증이 완료되었습니다."
  }
}
```

#### OTP 설정
```http
POST /api/auth/otp/setup
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": {
    "secretKey": "BASE32_SECRET",
    "qrCodeUrl": "otpauth://totp/..."
  }
}
```

#### OTP 검증
```http
POST /api/auth/otp/verify
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "code": "123456"
}

Response (200):
{
  "success": true,
  "data": {
    "verified": true
  }
}
```

---

### 3.3 사용자 API

#### 회원가입
```http
POST /api/users/add
Content-Type: application/json

Request:
{
  "userId": "user@email.com",
  "password": "Password123!",
  "passwordConfirm": "Password123!",
  "nickname": "닉네임",
  "phone": "010-1234-5678",
  "agreeMarketing": false
}

Response (201):
{
  "success": true,
  "data": {
    "userId": "user@email.com",
    "message": "회원가입이 완료되었습니다. 이메일을 확인해주세요."
  }
}
```

#### 내 정보 조회
```http
GET /api/users/me
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": {
    "userId": "user@email.com",
    "nickname": "닉네임",
    "phone": "010-1234-5678",
    "profileImage": "https://...",
    "role": "USER",
    "provider": "LOCAL",
    "otpEnabled": false,
    "regDate": "2025-01-01T00:00:00"
  }
}
```

#### 회원 정보 수정
```http
POST /api/users/update
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "nickname": "새닉네임",
  "agreeMarketing": true
}

Response (200):
{
  "success": true,
  "data": {
    "message": "회원 정보가 수정되었습니다."
  }
}
```

#### 비밀번호 변경
```http
POST /api/users/updatePwd
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!",
  "newPasswordConfirm": "NewPassword123!"
}

Response (200):
{
  "success": true,
  "data": {
    "message": "비밀번호가 변경되었습니다."
  }
}
```

#### 회원 탈퇴
```http
POST /api/users/delete
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "password": "Password123!",
  "deleteReason": "사용하지 않음"
}

Response (200):
{
  "success": true,
  "data": {
    "message": "회원 탈퇴가 완료되었습니다."
  }
}
```

---

### 3.4 파티 API

#### 파티 목록 조회
```http
GET /api/parties?page=0&size=12&platform=NETFLIX&status=RECRUITING

Response (200):
{
  "success": true,
  "data": {
    "content": [
      {
        "partyId": 1,
        "productName": "Netflix",
        "productImage": "https://...",
        "partyStatus": "RECRUITING",
        "maxMembers": 4,
        "currentMembers": 2,
        "monthlyFee": 4000,
        "startDate": "2025-01-01",
        "leaderNickname": "파티장"
      }
    ],
    "totalPages": 10,
    "totalElements": 100
  }
}
```

#### 파티 상세 조회
```http
GET /api/parties/{partyId}
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": {
    "partyId": 1,
    "productId": 1,
    "productName": "Netflix",
    "partyLeaderId": "leader@email.com",
    "partyStatus": "ACTIVE",
    "maxMembers": 4,
    "currentMembers": 3,
    "monthlyFee": 4000,
    "ottId": "netflix_id",
    "ottPassword": "********",
    "startDate": "2025-01-01",
    "members": [
      {
        "memberId": 1,
        "userId": "member@email.com",
        "nickname": "멤버1",
        "memberRole": "MEMBER",
        "memberStatus": "ACTIVE",
        "joinDate": "2025-01-02"
      }
    ]
  }
}
```

#### 파티 생성
```http
POST /api/parties
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "productId": 1,
  "maxMembers": 4,
  "monthlyFee": 4000,
  "startDate": "2025-02-01"
}

Response (201):
{
  "success": true,
  "data": {
    "partyId": 1,
    "message": "파티가 생성되었습니다. 보증금 결제를 진행해주세요."
  }
}
```

#### 파티 가입
```http
POST /api/parties/{partyId}/join
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "tossPaymentKey": "toss_payment_key",
  "orderId": "order_123",
  "paymentMethod": "CARD"
}

Response (200):
{
  "success": true,
  "data": {
    "partyMemberId": 1,
    "message": "파티에 가입되었습니다."
  }
}
```

#### 파티 탈퇴
```http
DELETE /api/parties/{partyId}/leave
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": {
    "message": "파티에서 탈퇴했습니다. 보증금 환불이 처리됩니다."
  }
}
```

#### 내 파티 목록
```http
GET /api/parties/my
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": [
    {
      "partyId": 1,
      "productName": "Netflix",
      "memberRole": "LEADER",
      "memberStatus": "ACTIVE",
      "monthlyFee": 4000
    }
  ]
}
```

#### OTT 계정 정보 수정 (파티장)
```http
PATCH /api/parties/{partyId}/ott-account
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "ottId": "new_netflix_id",
  "ottPassword": "new_password"
}

Response (200):
{
  "success": true,
  "data": {
    "message": "OTT 계정 정보가 수정되었습니다."
  }
}
```

---

### 3.5 결제 API

#### 내 결제 내역 조회
```http
GET /api/v1/payments/my
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": [
    {
      "paymentId": 1,
      "partyId": 1,
      "productName": "Netflix",
      "paymentType": "MONTHLY",
      "paymentAmount": 4000,
      "paymentStatus": "SUCCESS",
      "paymentDate": "2025-01-15T10:00:00",
      "targetMonth": "2025-01"
    }
  ]
}
```

#### 결제 상세 조회
```http
GET /api/v1/payments/{paymentId}
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": {
    "paymentId": 1,
    "partyId": 1,
    "productName": "Netflix",
    "paymentAmount": 4000,
    "paymentStatus": "SUCCESS",
    "paymentMethod": "CARD",
    "cardNumber": "1234-****-****-5678",
    "cardCompany": "삼성카드",
    "tossPaymentKey": "toss_key",
    "orderId": "order_123",
    "paymentDate": "2025-01-15T10:00:00"
  }
}
```

#### 결제 재시도
```http
POST /api/v1/payments/{paymentId}/retry
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": {
    "paymentId": 1,
    "paymentStatus": "SUCCESS",
    "message": "결제가 완료되었습니다."
  }
}
```

---

### 3.6 보증금 API

#### 내 보증금 조회
```http
GET /api/deposits/my
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": [
    {
      "depositId": 1,
      "partyId": 1,
      "productName": "Netflix",
      "depositType": "SECURITY",
      "depositAmount": 10000,
      "depositStatus": "PAID",
      "paymentDate": "2025-01-01T10:00:00"
    }
  ]
}
```

---

### 3.7 정산 API

#### 내 정산 내역 조회
```http
GET /api/settlements/my
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": [
    {
      "settlementId": 1,
      "partyId": 1,
      "productName": "Netflix",
      "settlementMonth": "2025-01",
      "totalAmount": 12000,
      "commissionRate": 0.15,
      "commissionAmount": 1800,
      "netAmount": 10200,
      "settlementStatus": "COMPLETED",
      "settlementDate": "2025-02-01T10:00:00"
    }
  ]
}
```

#### 정산 상세 조회
```http
GET /api/settlements/{settlementId}/details
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": {
    "settlementId": 1,
    "partyId": 1,
    "members": [
      {
        "userId": "member1@email.com",
        "nickname": "멤버1",
        "paidAmount": 4000
      }
    ],
    "totalAmount": 12000,
    "netAmount": 10200
  }
}
```

---

### 3.8 계좌 API

#### 1원 인증 요청
```http
POST /api/bank-account/verify-request
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "bankCode": "088",
  "accountNum": "1234567890",
  "accountHolder": "홍길동"
}

Response (200):
{
  "success": true,
  "data": {
    "bankTranId": "MOA_123456789",
    "message": "1원이 입금되었습니다. 입금자명의 4자리 숫자를 입력해주세요."
  }
}
```

#### 인증코드 검증
```http
POST /api/bank-account/verify
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "bankTranId": "MOA_123456789",
  "verifyCode": "1234"
}

Response (200):
{
  "success": true,
  "data": {
    "accountId": 1,
    "message": "계좌가 등록되었습니다."
  }
}
```

#### 내 계좌 조회
```http
GET /api/bank-account
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": {
    "accountId": 1,
    "bankCode": "088",
    "bankName": "신한은행",
    "accountNumber": "123-456-******",
    "accountHolder": "홍길동",
    "isVerified": true
  }
}
```

---

## 4. 데이터베이스 설계

### 4.1 ERD

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    USERS     │       │   PRODUCT    │       │   CATEGORY   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ USER_ID (PK) │       │PRODUCT_ID(PK)│◄──────│CATEGORY_ID(PK)
│ PASSWORD     │       │ CATEGORY_ID  │       │ CATEGORY_NAME│
│ NICKNAME     │       │ PRODUCT_NAME │       └──────────────┘
│ PHONE        │       │ PRICE        │
│ ROLE         │       │ MAX_SHARE    │
│ USER_STATUS  │       │ IMAGE        │
│ PROVIDER     │       └──────────────┘
│ OTP_ENABLED  │              │
└──────────────┘              │
       │                      │
       │         ┌────────────┴────────────┐
       │         │                         │
       ▼         ▼                         ▼
┌──────────────────────┐         ┌──────────────────┐
│       PARTY          │         │   SUBSCRIPTION   │
├──────────────────────┤         ├──────────────────┤
│ PARTY_ID (PK)        │         │SUBSCRIPTION_ID(PK)
│ PRODUCT_ID (FK)      │         │ USER_ID (FK)     │
│ PARTY_LEADER_ID (FK) │         │ PRODUCT_ID (FK)  │
│ PARTY_STATUS         │         │ START_DATE       │
│ MAX_MEMBERS          │         │ END_DATE         │
│ CURRENT_MEMBERS      │         └──────────────────┘
│ MONTHLY_FEE          │
│ OTT_ID               │
│ OTT_PASSWORD         │
│ ACCOUNT_ID (FK)      │
└──────────────────────┘
       │
       │
       ▼
┌──────────────────────┐
│    PARTY_MEMBER      │
├──────────────────────┤
│ PARTY_MEMBER_ID (PK) │
│ PARTY_ID (FK)        │◄────────────┐
│ USER_ID (FK)         │             │
│ MEMBER_ROLE          │             │
│ MEMBER_STATUS        │             │
│ JOIN_DATE            │             │
└──────────────────────┘             │
       │                             │
       ├─────────────┬───────────────┤
       │             │               │
       ▼             ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   DEPOSIT    │ │   PAYMENT    │ │  SETTLEMENT  │
├──────────────┤ ├──────────────┤ ├──────────────┤
│DEPOSIT_ID(PK)│ │PAYMENT_ID(PK)│ │SETTLEMENT_ID │
│ PARTY_ID     │ │ PARTY_ID     │ │ PARTY_ID     │
│PARTY_MEMBER_ID│ │PARTY_MEMBER_ID│ │PARTY_LEADER_ID
│ USER_ID      │ │ USER_ID      │ │ ACCOUNT_ID   │
│DEPOSIT_AMOUNT│ │PAYMENT_AMOUNT│ │ TOTAL_AMOUNT │
│DEPOSIT_STATUS│ │PAYMENT_STATUS│ │ NET_AMOUNT   │
│TOSS_PAYMENT_KEY│ │TOSS_PAYMENT_KEY│ │SETTLEMENT_STATUS
└──────────────┘ └──────────────┘ └──────────────┘
```

### 4.2 주요 테이블 설명

#### USERS (회원)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| USER_ID | VARCHAR(50) | 이메일 (PK) |
| PASSWORD | VARCHAR(255) | 비밀번호 (bcrypt, 소셜 로그인 시 NULL) |
| NICKNAME | VARCHAR(20) | 닉네임 |
| PHONE | VARCHAR(14) | 전화번호 |
| ROLE | VARCHAR(20) | 역할 (USER/ADMIN) |
| USER_STATUS | VARCHAR(20) | 상태 (ACTIVE/INACTIVE/DELETED) |
| PROVIDER | VARCHAR(50) | 로그인 제공자 (LOCAL/KAKAO/GOOGLE) |
| OTP_SECRET | VARCHAR(64) | Google OTP Secret |
| OTP_ENABLED | TINYINT(1) | OTP 활성화 여부 |

#### PARTY (파티)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| PARTY_ID | INT | 파티 ID (PK) |
| PRODUCT_ID | INT | 상품 ID (FK) |
| PARTY_LEADER_ID | VARCHAR(50) | 파티장 ID (FK) |
| PARTY_STATUS | VARCHAR(20) | 상태 (PENDING_PAYMENT/RECRUITING/ACTIVE/CLOSED) |
| MAX_MEMBERS | INT | 최대 인원 |
| CURRENT_MEMBERS | INT | 현재 인원 |
| MONTHLY_FEE | INT | 월 구독료 (인당) |
| OTT_ID | VARCHAR(100) | OTT 계정 ID |
| OTT_PASSWORD | VARCHAR(255) | OTT 계정 비밀번호 (암호화) |
| ACCOUNT_ID | INT | 정산 계좌 ID (FK) |

#### DEPOSIT (보증금)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| DEPOSIT_ID | INT | 보증금 ID (PK) |
| PARTY_ID | INT | 파티 ID (FK) |
| PARTY_MEMBER_ID | INT | 파티 멤버 ID (FK) |
| USER_ID | VARCHAR(50) | 사용자 ID (FK) |
| DEPOSIT_TYPE | VARCHAR(20) | 타입 (LEADER/SECURITY) |
| DEPOSIT_AMOUNT | INT | 보증금 금액 |
| DEPOSIT_STATUS | VARCHAR(20) | 상태 (PENDING/PAID/REFUNDED) |
| TOSS_PAYMENT_KEY | VARCHAR(255) | Toss 결제 키 |

#### PAYMENT (결제)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| PAYMENT_ID | INT | 결제 ID (PK) |
| PARTY_MEMBER_ID | INT | 파티 멤버 ID (FK) |
| PAYMENT_TYPE | VARCHAR(20) | 타입 (FIRST/MONTHLY) |
| PAYMENT_AMOUNT | INT | 결제 금액 |
| PAYMENT_STATUS | VARCHAR(20) | 상태 (PENDING/SUCCESS/FAILED) |
| TARGET_MONTH | VARCHAR(7) | 대상 월 (YYYY-MM) |
| TOSS_PAYMENT_KEY | VARCHAR(255) | Toss 결제 키 |

#### SETTLEMENT (정산)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| SETTLEMENT_ID | INT | 정산 ID (PK) |
| PARTY_ID | INT | 파티 ID (FK) |
| PARTY_LEADER_ID | VARCHAR(50) | 파티장 ID (FK) |
| ACCOUNT_ID | INT | 정산 계좌 ID (FK) |
| SETTLEMENT_MONTH | VARCHAR(7) | 정산 월 (YYYY-MM) |
| TOTAL_AMOUNT | INT | 총 금액 |
| COMMISSION_RATE | DECIMAL(3,2) | 수수료율 (0.15 = 15%) |
| COMMISSION_AMOUNT | INT | 수수료 금액 |
| NET_AMOUNT | INT | 순 정산 금액 |
| SETTLEMENT_STATUS | VARCHAR(20) | 상태 (PENDING/COMPLETED/FAILED) |

---

## 5. 핵심 기능 구현

### 5.1 인증 플로우 (JWT + Refresh Token)

```
┌──────────┐     POST /auth/login      ┌──────────┐
│  Client  │ ─────────────────────────▶│  Server  │
│          │◀───────────────────────── │          │
│          │   accessToken (15min)     │          │
│          │   refreshToken (7days)    │          │
└──────────┘                           └──────────┘
     │
     │ 15분 후 accessToken 만료
     │
     │     POST /auth/refresh
     │     Header: Refresh-Token
┌──────────┐ ─────────────────────────▶┌──────────┐
│  Client  │                           │  Server  │
│          │◀───────────────────────── │          │
│          │   새 accessToken          │          │
│          │   (새 refreshToken)       │          │
└──────────┘                           └──────────┘
```

**프론트엔드 (httpClient.js)**
- Axios 인터셉터로 401 응답 시 자동 토큰 갱신
- 갱신 중 다른 요청은 대기열에 추가
- 갱신 완료 후 대기 요청 재시도

### 5.2 결제 시스템 (Toss Payments)

```
┌──────────────────────────────────────────────────────────────┐
│                      결제 플로우                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. 빌링키 발급 (최초 1회)                                    │
│     User → Toss Payments → billingKey 발급 → DB 저장         │
│                                                              │
│  2. 자동 결제 (매월)                                          │
│     Scheduler → 파티 상태 검증 → billingKey로 결제 요청      │
│     ※ ACTIVE 상태인 파티만 결제 진행                         │
│     ※ SUSPENDED/DISBANDED/CLOSED 파티는 결제 스킵           │
│                                                              │
│  3. 결제 실패 시                                              │
│     1차: 즉시 재시도                                          │
│     2차: 1일 후 재시도                                        │
│     3차: 2일 후 재시도                                        │
│     4차: 3일 후 재시도 (최종)                                 │
│     4회 실패 → 파티 SUSPENDED 상태 전환                      │
│     → 파티장 및 전체 멤버에게 PARTY_SUSPENDED 푸시 알림      │
│                                                              │
│  4. 환불 에러 분류                                            │
│     - 재시도 가능: 네트워크 오류, 일시적 API 오류             │
│     - 재시도 불가: ALREADY_CANCELED, INVALID_CANCEL_AMOUNT,  │
│                   EXCEED_CANCEL_AMOUNT, CANCEL_PERIOD_EXPIRED │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 5.3 정산 시스템

```
정산 계산 공식:
────────────────────────────────────
총 수입 = 월회비 × 결제 완료 멤버 수 + 몰수 보증금
수수료 = 월회비 수입 × 15% (몰수 보증금은 수수료 없음)
순 정산액 = 총 수입 - 수수료
────────────────────────────────────

예시:
- 월회비: 4,000원
- 결제 멤버: 3명
- 총 수입: 12,000원
- 수수료 (15%): 1,800원
- 순 정산액: 10,200원

정산 예외 처리:
────────────────────────────────────
1. 계좌 미등록 시
   - 정산 상태: PENDING_ACCOUNT
   - 파티장에게 계좌 등록 요청 푸시 알림
   - 계좌 등록 후 자동으로 정산 진행

2. 정산 기간 미완료
   - 현재 날짜 이전의 완료된 billing cycle만 정산
   - SETTLEMENT_PERIOD_NOT_COMPLETED 에러 반환
────────────────────────────────────
```

### 5.4 보증금 시스템

```
┌─────────────────────────────────────────────────────────────┐
│                    보증금 플로우                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [파티장]                                                   │
│  - 파티 생성 시 보증금 결제 (월회비 × 2)                      │
│  - 파티 종료 시 보증금 환불                                  │
│  - 파티장 탈퇴 시 → 파티 해산, 멤버 보증금 환불              │
│                                                             │
│  [파티원]                                                   │
│  - 파티 가입 시 보증금 + 첫 달 회비 결제                      │
│  - 정상 탈퇴 시 보증금 전액 환불                              │
│  - 강제 탈퇴 시 보증금 몰수 (파티장에게 지급)                 │
│  - 파티 해산 시 보증금 전액 환불                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.5 예외 처리 시스템

```
┌─────────────────────────────────────────────────────────────┐
│                 사용자 탈퇴 이벤트 처리                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 이벤트 발행 (UserServiceImpl)                           │
│     - 사용자 탈퇴 시 UserDeletedEvent 발행                  │
│                                                             │
│  2. 이벤트 처리 (UserDeletionEventListener)                 │
│     @EventListener @Async @Transactional                    │
│                                                             │
│  3. 파티장으로서의 파티 처리                                 │
│     - 모집 중 파티: DISBANDED 상태 전환                     │
│     - 활성 파티: 모든 멤버 보증금 환불 + 파티 DISBANDED     │
│     - 전체 멤버에게 PARTY_DISBANDED 푸시 알림               │
│                                                             │
│  4. 파티원으로서의 멤버십 처리                               │
│     - 보증금 환불 처리                                       │
│     - 파티장에게 MEMBER_WITHDRAWN 푸시 알림                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 환불 에러 분류 시스템                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [재시도 불가 에러] (영구 실패)                               │
│  - ALREADY_CANCELED: 이미 취소된 결제                        │
│  - ALREADY_REFUNDED: 이미 환불된 결제                        │
│  - INVALID_CANCEL_AMOUNT: 잘못된 취소 금액                   │
│  - NOT_CANCELABLE_PAYMENT: 취소 불가 결제                    │
│  - EXCEED_CANCEL_AMOUNT: 취소 금액 초과                      │
│  - INVALID_PAYMENT_KEY: 잘못된 결제 키                       │
│  - NOT_FOUND_PAYMENT: 결제 없음                              │
│  - CANCEL_PERIOD_EXPIRED: 취소 기간 만료                     │
│                                                             │
│  [재시도 가능 에러] (임시 실패)                               │
│  - 네트워크 오류                                             │
│  - 일시적 API 오류                                           │
│  - 기타 미분류 에러                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.6 스케줄러 시스템

```
┌─────────────────────────────────────────────────────────────┐
│                      스케줄러 시스템                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [PaymentScheduler] - 결제 처리                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│  ■ 실행 시간: 매일 새벽 2시 (KST)                            │
│  ■ 기능:                                                     │
│    - 신규 월회비 결제 (파티 시작일 기준 자동 계산)            │
│    - 결제 재시도 처리                                         │
│    - 파티 상태 검증 (ACTIVE만 결제 진행)                     │
│                                                             │
│  ■ 재시도 전략:                                              │
│    1차: 즉시                                                 │
│    2차: +1일 후                                              │
│    3차: +2일 후                                              │
│    4차: +3일 후 (최종)                                        │
│    → 4회 실패 시 파티 SUSPENDED + 푸시 알림                  │
│                                                             │
│  ■ 추가 스케줄러: 결제 예정 알림 (매일 18시)                  │
│    - 다음날 결제 예정인 파티원에게 PAY_UPCOMING 푸시          │
│                                                             │
│  [SettlementScheduler] - 정산 처리                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│  ■ 월간 정산: 매월 1일 새벽 4시 (KST)                         │
│  ■ 기능:                                                     │
│    - 전월 사용분 정산 생성                                    │
│    - 오픈뱅킹 입금이체 자동 실행                              │
│    - 정산 완료 이벤트 발행                                    │
│                                                             │
│  ■ 정산 재시도: 매시간 정각 (KST)                             │
│    - FAILED 상태 정산 자동 재시도                             │
│    - 최소 2시간 간격 (지수 백오프)                            │
│    - bankTranId 있으면 재시도 불가 (수동 처리)               │
│                                                             │
│  ■ 정산 기간 계산:                                            │
│    - 파티 시작일 기준 billing cycle 자동 계산                 │
│    - 예: 1/15 시작 → 매월 15일~다음달 14일                    │
│                                                             │
│  [RefundScheduler] - 환불 재시도                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│  ■ 실행 시간: 매시간 정각 (KST)                              │
│  ■ 기능:                                                     │
│    - 실패한 보증금 환불 자동 재시도                           │
│    - 재시도 불가 에러 자동 분류                               │
│                                                             │
│  ■ 재시도 전략:                                              │
│    1차: 즉시 (환불 실패 시)                                   │
│    2차: +1시간                                               │
│    3차: +4시간                                               │
│    4차: +24시간 (최종)                                        │
│                                                             │
│  ■ 재시도 불가 에러:                                          │
│    - ALREADY_CANCELED, ALREADY_REFUNDED                     │
│    - INVALID_CANCEL_AMOUNT, EXCEED_CANCEL_AMOUNT           │
│    - CANCEL_PERIOD_EXPIRED, INVALID_PAYMENT_KEY            │
│    - NOT_FOUND_PAYMENT, NOT_CANCELABLE_PAYMENT             │
│                                                             │
│  [기타 스케줄러]                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│  ■ PartyCloseScheduler: 종료일 지난 파티 자동 종료           │
│  ■ PendingDepositCleanupScheduler: 미결제 보증금 정리       │
│  ■ PaymentTimeoutScheduler: 결제 타임아웃 처리              │
│  ■ ExpiredPartyCleanupScheduler: 만료 파티 정리             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**스케줄러 격리 (Isolation):**
- 개별 파티/멤버 실패가 전체 프로세스에 영향 없음
- try-catch로 예외 처리 후 다음 항목 계속 진행
- 상세 로그 기록으로 디버깅 용이

**시간대 설정:**
```java
@Scheduled(cron = "0 0 2 * * *", zone = "Asia/Seoul")
```
- 모든 스케줄러에 명시적 시간대 설정
- 서버 시간대 변경에 영향 받지 않음

---

## 6. 배포 구성

### 6.1 AWS 아키텍처 (예정)

```
                    ┌─────────────┐
                    │  Route 53   │
                    │ (DNS)       │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │    ALB      │
                    │ (HTTPS/443) │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
   ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
   │   EC2 #1    │  │   EC2 #2    │  │     S3      │
   │  (Backend)  │  │  (Frontend) │  │  (Static)   │
   └──────┬──────┘  └─────────────┘  └─────────────┘
          │
   ┌──────▼──────┐
   │   RDS       │
   │  (MySQL)    │
   └─────────────┘
```

### 6.2 배포 URL

- **프로덕션**: https://www.moamoa.cloud/
- **API 서버**: https://api.moamoa.cloud/

---

## 7. 개발 환경 설정

### 7.1 프론트엔드

```bash
# 저장소 클론
git clone https://github.com/your-repo/4beans-moa-front.git
cd 4beans-moa-front

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

### 7.2 백엔드

```bash
# 저장소 클론
git clone https://github.com/your-repo/4beans-moa-backend.git
cd 4beans-moa-backend

# Gradle 빌드
./gradlew build

# 실행
java -jar build/libs/moa-0.0.1-SNAPSHOT.jar

# 또는 개발 모드
./gradlew bootRun
```

### 7.3 환경 변수

**프론트엔드 (.env)**
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_TOSS_CLIENT_KEY=your_toss_client_key
```

**백엔드 (application.yml)**
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/moa
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

jwt:
  secret: ${JWT_SECRET}
  access-token-validity: 3600000    # 1시간
  refresh-token-validity: 604800000 # 7일

toss:
  secret-key: ${TOSS_SECRET_KEY}

oauth:
  kakao:
    client-id: ${KAKAO_CLIENT_ID}
    client-secret: ${KAKAO_CLIENT_SECRET}
  google:
    client-id: ${GOOGLE_CLIENT_ID}
    client-secret: ${GOOGLE_CLIENT_SECRET}
```

---

## 부록

### A. 상태 코드 정의

#### 파티 상태 (PARTY_STATUS)
| 코드 | 설명 |
|------|------|
| PENDING_PAYMENT | 파티장 보증금 결제 대기 |
| RECRUITING | 멤버 모집 중 |
| ACTIVE | 활성 (정상 운영) |
| SUSPENDED | 일시정지 (결제 4회 실패 등) |
| DISBANDED | 해산 (파티장 탈퇴 등) |
| CLOSED | 종료 |

#### 멤버 상태 (MEMBER_STATUS)
| 코드 | 설명 |
|------|------|
| PENDING_PAYMENT | 결제 대기 |
| ACTIVE | 활성 |
| WITHDRAWN | 탈퇴 |
| KICKED | 강제 탈퇴 |

#### 결제 상태 (PAYMENT_STATUS)
| 코드 | 설명 |
|------|------|
| PENDING | 결제 대기 |
| SUCCESS | 결제 성공 |
| FAILED | 결제 실패 |
| REFUNDED | 환불 완료 |

#### 정산 상태 (SETTLEMENT_STATUS)
| 코드 | 설명 |
|------|------|
| PENDING | 정산 대기 |
| PENDING_ACCOUNT | 계좌 대기 (파티장 계좌 미등록) |
| IN_PROGRESS | 정산 진행 중 |
| COMPLETED | 정산 완료 |
| FAILED | 정산 실패 |

### B. 에러 코드

| 코드 | 설명 |
|------|------|
| AUTH_001 | 인증 실패 |
| AUTH_002 | 토큰 만료 |
| AUTH_003 | 권한 없음 |
| USER_001 | 사용자를 찾을 수 없음 |
| USER_002 | 이메일 중복 |
| PARTY_001 | 파티를 찾을 수 없음 |
| PARTY_002 | 파티 정원 초과 |
| PARTY_003 | 이미 가입된 파티 |
| P410 | 일시정지된 파티 |
| P411 | 해산된 파티 |
| P412 | 파티장 탈퇴로 파티 해산 |
| PAYMENT_001 | 결제 실패 |
| PAYMENT_002 | 빌링키 없음 |
| ACC401 | 정산 계좌 미등록 |
| REF501 | 일시적 환불 오류 (재시도 가능) |
| REF502 | 영구적 환불 오류 (재시도 불가) |

---

**문서 버전**: 2.0.0
**최종 수정일**: 2025-12-12
**작성자**: 4beans 팀

---

### C. 푸시 알림 코드

| 코드 | 모듈 타입 | 설명 |
|------|-----------|------|
| PAY_UPCOMING | PARTY | 결제 예정 알림 (D-1) |
| PAY_SUCCESS | PAYMENT | 결제 성공 알림 |
| PAY_FAILED | PAYMENT | 결제 실패 알림 |
| PARTY_DISBANDED | PARTY | 파티 해산 알림 |
| MEMBER_WITHDRAWN | PARTY | 파티원 탈퇴 알림 |
| PARTY_SUSPENDED | PARTY | 파티 일시정지 알림 |
| SETTLEMENT_COMPLETE | SETTLEMENT | 정산 완료 알림 |
