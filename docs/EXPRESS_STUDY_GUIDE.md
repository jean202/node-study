# Express & Node.js 핵심 학습 가이드

이 가이드는 `nest/src/movies`에서 만든 CRUD를 Express로 다시 만들면서,
Nest가 감춰둔 Node.js의 본질을 직접 체감하는 것이 목표다.

코드를 직접 타이핑하면서 진행한다. 각 단계마다 "왜 이걸 하는지"를 먼저 읽고, 스스로 구현한 뒤, 체크리스트로 점검한다.

---

## 사전 준비

`express/` 폴더에서 진행한다.
현재 `server.js`는 `node:http`로 만든 Hello World가 있다.
이 파일은 남겨두고 새 파일들을 만든다.

---

## Phase 1: Node.js 런타임 이해

> 팀장님이 말한 "노드의 본질"이 여기에 있다.
> 이 단계는 Express와 무관하게 Node.js 자체를 이해하는 단계다.

### 1-1. 이벤트 루프 직접 확인

**목표**: 싱글 스레드에서 비동기가 어떻게 동작하는지 눈으로 보기

**할 일**: `event-loop-test.js` 파일을 만들고 아래 4가지를 한 파일에 작성한 뒤 실행해 본다.

- `console.log('1: 동기')` (일반 코드)
- `setTimeout(() => console.log('2: 타이머'), 0)` (타이머 큐)
- `Promise.resolve().then(() => console.log('3: 마이크로태스크'))` (마이크로태스크 큐)
- `process.nextTick(() => console.log('4: nextTick'))` (nextTick 큐)

**확인 포인트**:
- [ ] 출력 순서가 `1 → 4 → 3 → 2`인가?
- [ ] 왜 `nextTick`이 `Promise`보다 먼저인가? (Node.js 이벤트 루프 우선순위)
- [ ] 왜 `setTimeout(fn, 0)`이 가장 나중인가?

**핵심 개념**: Node.js는 싱글 스레드지만 이벤트 루프가 작업을 큐별로 나눠서 처리한다.
이미 `event-roop.puml`을 만들어뒀으니, 실제 실행 결과와 다이어그램을 비교해 본다.

### 1-2. 블로킹 vs 논블로킹 체감

**목표**: 싱글 스레드에서 블로킹이 왜 치명적인지 체감하기

**할 일**: `blocking-test.js` 파일을 만들고 아래 시나리오를 구현한다.

1. `node:http`로 서버를 만든다 (포트 3001)
2. `/fast` 엔드포인트: 즉시 "fast" 응답
3. `/slow` 엔드포인트: `for` 루프로 50억 번 빈 연산 후 "slow" 응답
4. 터미널 두 개를 열고, `/slow` 요청 직후 바로 `/fast`를 요청한다

**확인 포인트**:
- [ ] `/slow` 처리 중에 `/fast`도 멈추는가?
- [ ] 이것이 "싱글 스레드의 한계"임을 이해했는가?
- [ ] 실무에서 CPU 집약 작업을 왜 Worker Thread나 외부 서비스로 빼는지 감이 오는가?

### 1-3. 모듈 시스템 이해

**목표**: `import/export`가 실제로 어떻게 동작하는지 이해하기

**할 일**: `modules/` 폴더를 만들고 3개 파일을 만든다.

- `math.js`: `add`, `multiply` 함수를 named export
- `logger.js`: default export로 로그 함수 하나
- `index.js`: 위 두 모듈을 import해서 사용

**확인 포인트**:
- [ ] named export vs default export 차이를 설명할 수 있는가?
- [ ] `package.json`의 `"type": "module"`을 빼면 어떤 에러가 나는가?
- [ ] `import { createServer } from 'node:http'`에서 `node:` 접두사의 의미는?

**심화**: `math.js`에서 `console.log('math 로드됨')`을 최상단에 넣고,
`index.js`에서 두 번 import하면 로그가 몇 번 찍히는지 확인한다. (모듈 캐싱)

---

## Phase 2: Express 기초 — 미들웨어 이해

> Nest의 `ValidationPipe`, `ParseIntPipe`, 에러 핸들러가 전부 미들웨어 개념 위에 있다.
> Express에서 이걸 직접 만들어봐야 Nest가 왜 그렇게 설계됐는지 보인다.

### 2-1. 최소 Express 서버

**목표**: Express가 `node:http` 위에 얹어진 것임을 확인

**할 일**: `app.js` 파일을 만든다.

1. `express()`로 앱 생성
2. `app.get('/', (req, res) => ...)` 하나만 등록
3. `app.listen(3000)` 으로 실행

**확인 포인트**:
- [ ] `server.js`의 `createServer` 콜백과 Express의 `(req, res)` 구조가 같다는 걸 확인했는가?
- [ ] Express의 `res.json()`은 `node:http`의 `res.setHeader()` + `res.end()`를 감싼 것임을 이해했는가?

### 2-2. 미들웨어 체인 실험

**목표**: `app.use()`와 `next()`의 동작 원리 이해

**할 일**: `app.js`에 미들웨어 3개를 순서대로 등록한다.

```
요청 → [로깅 미들웨어] → [인증 체크 미들웨어] → [라우트 핸들러] → 응답
```

1. **로깅 미들웨어**: `req.method`, `req.url`, 현재 시간을 콘솔에 출력하고 `next()` 호출
2. **인증 체크 미들웨어**: 헤더에 `x-auth` 값이 없으면 `401` 응답, 있으면 `next()` 호출
3. **라우트 핸들러**: 정상 응답

**확인 포인트**:
- [ ] `next()`를 빼면 요청이 멈추는가? (응답도 안 가고 타임아웃됨)
- [ ] 미들웨어 순서를 바꾸면 동작이 달라지는가?
- [ ] Nest의 `main.ts`에서 `app.useGlobalPipes()`가 결국 미들웨어 등록이라는 걸 이해했는가?

### 2-3. 에러 처리 미들웨어

**목표**: Express의 에러 핸들링 패턴 이해 (Nest의 `NotFoundException` 등의 원형)

**할 일**: 인자가 4개인 미들웨어 `(err, req, res, next)`를 맨 마지막에 등록한다.

- 라우트 안에서 `next(new Error('something wrong'))` 호출
- 에러 미들웨어에서 `err.message`를 JSON으로 응답

**확인 포인트**:
- [ ] 일반 미들웨어(인자 3개)와 에러 미들웨어(인자 4개)의 차이를 설명할 수 있는가?
- [ ] Nest의 `NotFoundException`이 결국 이 패턴을 추상화한 것임을 이해했는가?

---

## Phase 3: Express로 Movies CRUD 만들기

> Nest에서 했던 것과 똑같은 기능을 프레임워크의 도움 없이 만든다.
> 가장 많이 배우는 구간이다.

### 3-1. 폴더 구조 직접 설계

**목표**: Nest가 자동으로 잡아주는 구조를 직접 만들어보기

**만들 폴더/파일 구조**:

```
express/
  app.js              ← 앱 진입점 (Nest의 main.ts + app.module.ts 역할)
  routes/
    movies.router.js  ← 라우팅 정의 (Nest의 movies.controller.ts 역할)
  services/
    movies.service.js ← 비즈니스 로직 (Nest의 movies.service.ts 역할)
  middlewares/
    logger.js         ← 로깅 미들웨어
    error-handler.js  ← 에러 처리 미들웨어
```

**Nest와 비교 포인트**:
| Nest | Express (직접 구현) |
|------|-------------------|
| `@Controller('movies')` | `express.Router()` + `app.use('/movies', router)` |
| `@Injectable()` + DI | `new MoviesService()` 직접 생성 |
| `@Body()` | `req.body` (+ `express.json()` 미들웨어 필요) |
| `@Param('id', ParseIntPipe)` | `Number(req.params.id)` + 직접 검증 |
| `NotFoundException` | 직접 에러 객체 만들어서 `next(err)` |
| `ValidationPipe` | `if (!title)` 같은 직접 검증 or 검증 미들웨어 |

### 3-2. Router 구현

**목표**: `movies.router.js`에 5개 엔드포인트 구현

구현할 엔드포인트 (Nest 컨트롤러와 1:1 대응):

| HTTP | 경로 | 설명 |
|------|------|------|
| POST | `/movies` | 영화 생성 |
| GET | `/movies` | 전체 목록 |
| GET | `/movies/:id` | 단건 조회 |
| PATCH | `/movies/:id` | 수정 |
| DELETE | `/movies/:id` | 삭제 |

**구현 순서 (이 순서대로 하나씩 만들고 curl로 테스트)**:

1. `GET /movies` → 빈 배열 `[]` 반환되는 것부터 확인
2. `POST /movies` → 영화 생성 후 `201` 응답
3. `GET /movies/:id` → 단건 조회, 없으면 `404`
4. `PATCH /movies/:id` → 부분 수정
5. `DELETE /movies/:id` → 삭제 후 `204`

**중요**: `app.js`에 `express.json()` 미들웨어를 등록해야 `req.body`를 쓸 수 있다.
이걸 빼먹으면 `req.body`가 `undefined`다. Nest에서는 자동으로 되던 것이다.

### 3-3. Service 분리

**목표**: 라우터에 로직을 다 넣지 않고 서비스로 분리

**할 일**:
1. `movies.service.js`에 클래스를 만든다
2. `movies` 배열과 `nextId`를 클래스 내부에 둔다
3. `create`, `findAll`, `findOne`, `update`, `remove` 메서드를 만든다
4. 라우터에서 `new MoviesService()`로 인스턴스를 만들어 사용한다

**확인 포인트**:
- [ ] 라우터 파일에서 `new MoviesService()`를 직접 하는 게 번거로운가?
- [ ] 만약 서비스가 다른 서비스에 의존하면 어떻게 되는가?
- [ ] 이 불편함이 Nest의 DI(`@Injectable()`)가 존재하는 이유임을 체감했는가?

### 3-4. 입력 검증 직접 구현

**목표**: Nest의 `ValidationPipe` + DTO가 해주던 일을 직접 해보기

**할 일**: `POST /movies` 요청에서 아래를 직접 검증한다.

- `title`: 문자열, 비어있으면 안 됨
- `year`: 숫자, 정수, 1888 이상
- `genres`: 배열, 1개 이상, 각 원소 문자열

**구현 방법 2가지 (둘 다 해보면 좋다)**:

1. **라우터 안에서 직접 if문**: 가장 원시적. 코드가 길어지는 걸 체감
2. **검증 미들웨어로 분리**: 함수로 빼서 `router.post('/movies', validate, handler)` 형태로 사용

**확인 포인트**:
- [ ] if문으로 검증하면 코드가 얼마나 길어지는가?
- [ ] `PATCH`에서는 선택 필드 검증이 더 복잡해지는가?
- [ ] Nest의 `class-validator` 데코레이터가 왜 편한지 체감되는가?

---

## Phase 4: 되돌아보기

### Nest vs Express 체감 비교표

이 표를 직접 채워본다. 코드를 다 만든 후에 작성해야 의미가 있다.

| 항목 | Express에서 직접 한 일 | Nest가 대신 해준 일 |
|------|----------------------|-------------------|
| 라우팅 등록 | | |
| 요청 바디 파싱 | | |
| 파라미터 타입 변환 | | |
| 입력 검증 | | |
| 에러 처리 | | |
| 의존성 관리 | | |
| 모듈 구조화 | | |

### 생각해볼 질문들

- Express에서 "이건 내가 매번 해야 하네"라고 느낀 게 있는가? 그게 Nest가 존재하는 이유다.
- 반대로, Nest를 쓸 때 "이게 뭔지 모르겠는데 일단 따라했다"라는 게 있었는가? 이제 설명할 수 있는가?
- 싱글 스레드 이벤트 루프 위에서 `for` 루프 50억 번이 다른 요청을 막았던 걸 기억하는가? 실무에서 이 상황이 생기면 어떻게 하겠는가?

---

## curl 테스트 명령어 참고

직접 타이핑해서 테스트한다. 복붙하지 말 것.

```bash
# 영화 생성
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{"title":"Inception","year":2010,"genres":["SF","Thriller"]}'

# 전체 조회
curl http://localhost:3000/movies

# 단건 조회
curl http://localhost:3000/movies/1

# 수정
curl -X PATCH http://localhost:3000/movies/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Interstellar"}'

# 삭제
curl -X DELETE http://localhost:3000/movies/1

# 검증 실패 테스트
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{"title":"","year":"abc","genres":[]}'
```

---

## 참고: 이 가이드에서 일부러 뺀 것들

- TypeScript: Express 단계에서는 JS로 Node.js 본질에 집중한다
- 데이터베이스: 메모리 배열로 충분하다. DB는 Nest로 돌아간 뒤에 한다
- 테스트 코드: 이 단계의 목표가 아니다
- 환경변수/설정: 복잡도를 높이지 않는다
