# Nest + TypeScript 학습 커리큘럼

## 목표

목표는 `Nest + TypeScript`로 REST API를 설계하고 구현하는 흐름을 익힌 뒤, 이를 바탕으로 `meetric` 프로젝트 API를 직접 만들 수 있는 수준까지 가는 것이다.  
나중에 `bakery` 같은 프론트 프로젝트와 연결하더라도 대응할 수 있도록, 단순 문법 학습보다 실전 API 구조에 초점을 둔다.

## 학습 원칙

- `JavaScript`는 건너뛰고 `TypeScript`로 바로 학습한다.
- `Express`는 따로 깊게 파지 않고 `NestJS`로 바로 간다.
- 기능 개수보다 `DTO`, `검증`, `인증`, `예외 처리`, `DB 연동`을 제대로 익히는 데 집중한다.
- 화면 기준이 아니라 도메인 기준으로 API를 나누는 습관을 들인다.

## 전체 로드맵

1. `Nest + TS` 기본기
2. `CRUD + DTO + Validation`
3. `Auth + JWT + Refresh Token`
4. `DB 연동 + 관계 모델링`
5. `meetric` 실전 API 구현
6. `테스트 + 문서화 + 운영 기초`

## 1단계. Nest + TS 기본기

### 목표

Nest의 기본 구조와 흐름을 익힌다.

### 학습 내용

- `Controller`, `Service`, `Module` 역할 이해
- `main.ts`, `app.module.ts` 흐름 이해
- Nest의 `Dependency Injection` 개념 익히기
- 간단한 GET/POST API 작성

### 실습 API

- `GET /health`
- `GET /hello`
- `POST /echo`

### 체크포인트

- 요청이 어디로 들어와서 어디서 처리되는지 설명할 수 있어야 한다.
- 컨트롤러와 서비스의 책임을 분리할 수 있어야 한다.

## 2단계. CRUD + DTO + Validation

### 목표

REST API의 기본 구조를 만들고, 입력 검증까지 포함한 서버 코드를 익힌다.

### 학습 내용

- 리소스 1개를 골라 CRUD 구현
- `CreateDto`, `UpdateDto` 분리
- `ValidationPipe` 전역 적용
- `class-validator`, `class-transformer` 사용
- `path param`, `query param`, `pagination` 처리
- 예외 상황에 맞는 HTTP status 코드 반환

### 실습 리소스 예시

- `users`
- `posts`
- `projects`
- 또는 `meetric`와 유사한 도메인 하나

### 실습 API

- `POST /items`
- `GET /items`
- `GET /items/:id`
- `PATCH /items/:id`
- `DELETE /items/:id`

### 체크포인트

- 요청 바디를 DTO로 검증할 수 있어야 한다.
- 목록 조회 시 페이지네이션과 필터를 받을 수 있어야 한다.
- 잘못된 요청에 대해 적절한 에러를 반환할 수 있어야 한다.

## 3단계. Auth + JWT + Refresh Token

### 목표

실전 API에서 가장 중요한 인증 흐름을 구현한다.

### 학습 내용

- 회원가입
- 로그인
- `access token` 발급
- `refresh token` 발급 및 재발급
- `bcrypt`로 비밀번호 해시
- `AuthGuard`로 보호된 API 구성
- 현재 로그인 사용자 조회

### 실습 API

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`

### 체크포인트

- 로그인 시 액세스 토큰과 리프레시 토큰을 발급할 수 있어야 한다.
- 인증이 필요한 API를 가드로 보호할 수 있어야 한다.
- 토큰 만료와 인증 실패 흐름을 설명할 수 있어야 한다.

## 4단계. DB 연동 + 관계 모델링

### 목표

메모리 저장소를 벗어나 실제 데이터베이스 기반 API를 구현한다.

### 권장 스택

- ORM: `Prisma`
- DB: 처음엔 `SQLite` 또는 바로 `PostgreSQL`

### 학습 내용

- Prisma 스키마 작성
- 마이그레이션 수행
- 시드 데이터 생성
- `1:N`, `N:1` 관계 모델링
- 서비스 계층에서 DB 접근 분리

### 연습 예시

- `User 1:N Project`
- `Project 1:N Record`

### 체크포인트

- 단일 테이블 CRUD를 넘어 관계 데이터를 조회할 수 있어야 한다.
- 서비스 로직과 DB 접근 로직이 뒤섞이지 않도록 구조를 유지해야 한다.

## 5단계. meetric 실전 API 구현

### 목표

학습용이 아닌 실제 프로젝트 API를 구현한다.

### 접근 방식

- 처음부터 전체를 만들지 않는다.
- 핵심 유스케이스 3~5개만 먼저 구현한다.
- 화면 단위가 아니라 도메인 단위로 자원을 나눈다.

### 추천 구현 순서

1. 인증
2. 핵심 엔터티 생성
3. 목록 조회
4. 상세 조회
5. 수정/삭제
6. 상태 변경이 필요한 비즈니스 로직

### 예시

- `POST /auth/login`
- `POST /projects`
- `GET /projects`
- `GET /projects/:id`
- `PATCH /projects/:id`
- `DELETE /projects/:id`

### 체크포인트

- 프론트 없이도 API만으로 유스케이스가 성립해야 한다.
- 단순 CRUD 외에 상태 전이나 권한 체크가 들어간 API를 최소 1개 이상 구현해야 한다.

## 6단계. 테스트 + 문서화 + 운영 기초

### 목표

붙일 수 있는 API 형태로 마무리한다.

### 학습 내용

- `Swagger` 문서화
- `Jest`, `supertest`로 e2e 테스트 작성
- 환경변수 분리
- 전역 예외 처리
- 로깅 기초

### 최소 테스트 범위

- 로그인 성공/실패
- 인증이 필요한 API 접근
- 리소스 생성/조회
- 잘못된 입력값 검증

### 체크포인트

- API 문서를 보고 다른 사람이 호출할 수 있어야 한다.
- 최소 2~3개의 e2e 테스트가 돌아가야 한다.

## 2주 학습 플랜

### 1주차

- 1일차: Nest 프로젝트 생성, `Controller/Service/Module` 이해
- 2일차: `GET /hello`, `GET /health`, `POST /echo` 구현
- 3일차: CRUD 리소스 1개 생성
- 4일차: DTO, ValidationPipe, 예외 처리 적용
- 5일차: Prisma 도입, DB 연결
- 6일차: 엔터티 관계 설계
- 7일차: CRUD를 DB 기반으로 전환

### 2주차

- 8일차: 회원가입, 로그인 구현
- 9일차: JWT 가드, `GET /auth/me` 구현
- 10일차: Refresh Token 구현
- 11일차: meetric 핵심 엔터티 첫 번째 API 구현
- 12일차: 목록/상세/수정/삭제 구현
- 13일차: 비즈니스 규칙이 들어간 API 구현
- 14일차: Swagger, e2e 테스트, 구조 정리

## 추천 기술 스택

- Framework: `NestJS`
- Language: `TypeScript`
- ORM: `Prisma`
- Database: `PostgreSQL`
- Validation: `class-validator`, `class-transformer`
- Auth: `@nestjs/jwt`, `passport-jwt`, `bcrypt`
- Docs: `@nestjs/swagger`
- Test: `Jest`, `supertest`

## 학습할 때 계속 확인할 질문

- 이 API는 컨트롤러, 서비스, DTO 책임이 분리되어 있는가?
- 입력값 검증이 서버에서 강제되는가?
- 인증이 필요한 API와 공개 API가 명확히 나뉘는가?
- 에러 응답이 일관적인가?
- 지금 구현이 `meetric` 실전에 바로 이어질 수 있는가?

## 다음 단계

이 문서를 기준으로 바로 이어서 정리할 수 있는 항목은 다음과 같다.

- `node_study`용 Nest 프로젝트 폴더 구조
- 1단계에서 만들 API 명세
- `meetric` 첫 엔터티 후보와 API 우선순위
