# Requirements Document

## Introduction

MOA 서비스에서 파티장에게 정산금을 자동으로 이체하기 위한 Mock 오픈뱅킹 API 시스템을 구현한다. 실제 오픈뱅킹 API(금융결제원) 스펙을 따르는 Mock 서버를 구축하여, 나중에 실제 API로 교체할 수 있는 구조로 설계한다. 파티장은 1원 인증을 통해 계좌를 등록하고, 스케줄러가 자동으로 정산을 처리한다.

## Glossary

- **Mock_OpenBanking_Server**: 오픈뱅킹 API 스펙을 따르는 시뮬레이션 서버
- **OpenBanking_Client**: Mock 서버 또는 실제 오픈뱅킹 API를 호출하는 클라이언트
- **Fintech_Use_Num**: 핀테크이용번호, 계좌를 식별하는 고유 토큰
- **1원_인증**: 계좌에 1원을 입금하고 입금자명에 포함된 인증코드로 본인 확인하는 방식
- **Settlement_Scheduler**: 정산 대상을 조회하고 자동으로 이체를 처리하는 스케줄러
- **Bank_Account**: 파티장이 등록한 정산용 계좌 정보
- **Transfer_Transaction**: 입금이체 거래 기록

## Requirements

### Requirement 1: 파티장 계좌 등록 (1원 인증)

**User Story:** As a 파티장, I want to 1원 인증으로 내 계좌를 등록하고 싶다, so that 정산금을 자동으로 받을 수 있다.

#### Acceptance Criteria

1. WHEN 파티장이 은행코드, 계좌번호, 예금주명을 입력하고 인증 요청을 하면 THEN THE Mock_OpenBanking_Server SHALL 1원 입금 요청을 처리하고 4자리 인증코드를 생성하여 응답한다
2. WHEN 1원 인증 요청이 성공하면 THEN THE System SHALL 생성된 인증코드를 파티장 이메일로 발송한다
3. WHEN 파티장이 올바른 인증코드를 입력하면 THEN THE Mock_OpenBanking_Server SHALL 인증을 성공 처리하고 Fintech_Use_Num을 발급한다
4. WHEN 인증이 성공하면 THEN THE System SHALL 파티장의 Bank_Account 정보를 저장하고 정산 가능 상태로 설정한다
5. WHEN 파티장이 잘못된 인증코드를 3회 이상 입력하면 THEN THE System SHALL 해당 인증 세션을 만료시키고 재인증을 요구한다
6. WHEN 인증코드 생성 후 5분이 경과하면 THEN THE System SHALL 해당 인증코드를 만료 처리한다

### Requirement 2: Mock 오픈뱅킹 API 서버

**User Story:** As a 개발자, I want to 오픈뱅킹 API 스펙을 따르는 Mock 서버를 구축하고 싶다, so that 나중에 실제 API로 쉽게 교체할 수 있다.

#### Acceptance Criteria

1. WHEN OpenBanking_Client가 1원 인증 요청 API를 호출하면 THEN THE Mock_OpenBanking_Server SHALL 오픈뱅킹 표준 요청/응답 형식으로 처리한다
2. WHEN OpenBanking_Client가 인증 검증 API를 호출하면 THEN THE Mock_OpenBanking_Server SHALL 저장된 인증코드와 비교하여 결과를 반환한다
3. WHEN OpenBanking_Client가 입금이체 API를 호출하면 THEN THE Mock_OpenBanking_Server SHALL 거래를 기록하고 성공 응답을 반환한다
4. WHEN API 요청에 필수 파라미터가 누락되면 THEN THE Mock_OpenBanking_Server SHALL 오픈뱅킹 표준 에러코드와 메시지를 반환한다
5. WHEN 존재하지 않는 Fintech_Use_Num으로 이체 요청이 오면 THEN THE Mock_OpenBanking_Server SHALL 계좌 미등록 에러를 반환한다

### Requirement 3: 자동 정산 처리

**User Story:** As a 시스템 관리자, I want to 정산이 자동으로 처리되길 원한다, so that 수동 작업 없이 파티장에게 정산금이 지급된다.

#### Acceptance Criteria

1. WHEN 매일 지정된 시간(오전 10시)이 되면 THEN THE Settlement_Scheduler SHALL 정산 대기 상태인 Settlement 목록을 조회한다
2. WHEN 정산 대상 파티장의 Bank_Account가 등록되어 있으면 THEN THE Settlement_Scheduler SHALL OpenBanking_Client를 통해 입금이체를 요청한다
3. WHEN 입금이체가 성공하면 THEN THE System SHALL Settlement 상태를 COMPLETED로 변경하고 거래 ID를 기록한다
4. WHEN 입금이체가 실패하면 THEN THE System SHALL Settlement 상태를 FAILED로 변경하고 실패 사유를 기록한다
5. WHEN 정산 대상 파티장의 Bank_Account가 미등록 상태이면 THEN THE System SHALL 해당 정산을 건너뛰고 파티장에게 계좌 등록 요청 알림을 발송한다
6. WHEN 정산 처리가 완료되면 THEN THE System SHALL 파티장에게 정산 완료 알림을 발송한다

### Requirement 4: 정산 내역 조회

**User Story:** As a 파티장, I want to 내 정산 내역을 조회하고 싶다, so that 정산이 제대로 되었는지 확인할 수 있다.

#### Acceptance Criteria

1. WHEN 파티장이 정산 내역 페이지에 접근하면 THEN THE System SHALL 해당 파티장의 모든 정산 기록을 최신순으로 표시한다
2. WHEN 정산 내역을 표시할 때 THEN THE System SHALL 정산일, 파티명, 금액, 상태(대기/완료/실패)를 포함한다
3. WHEN 정산 상태가 FAILED인 경우 THEN THE System SHALL 실패 사유를 함께 표시한다
4. WHEN 파티장이 특정 기간으로 필터링하면 THEN THE System SHALL 해당 기간의 정산 내역만 표시한다

### Requirement 5: 계좌 관리

**User Story:** As a 파티장, I want to 등록된 계좌를 관리하고 싶다, so that 필요시 계좌를 변경할 수 있다.

#### Acceptance Criteria

1. WHEN 파티장이 마이페이지에서 계좌 정보를 조회하면 THEN THE System SHALL 등록된 은행명과 마스킹된 계좌번호를 표시한다
2. WHEN 파티장이 계좌 변경을 요청하면 THEN THE System SHALL 새로운 1원 인증 절차를 시작한다
3. WHEN 새 계좌 인증이 완료되면 THEN THE System SHALL 기존 계좌를 비활성화하고 새 계좌를 활성화한다
4. WHEN 파티장이 계좌를 삭제하면 THEN THE System SHALL 해당 계좌를 비활성화하고 정산 불가 상태로 변경한다
