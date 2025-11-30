# 에이전트 테스팅 규칙 (Playwright)

---
agent_spec: v1  
doc: testing  
scope: repo  
precedence: 120  
language: ko  
---

이 문서는 **E2E/통합 테스트** 규칙을 정의한다.  
Global 규칙(`AGENTS.md`)보다 **우선(precedence 120)** 적용된다.

핵심 목표
- 사람이 작성한 **TODO 시나리오 문서**(자연어)를 기반으로 안정적인 E2E 테스트를 만든다.
- **Playwright Test Agents** (planner → generator → healer) 흐름을 활용해 **테스트 플랜 → 코드 → 실패 시 치유** 루프를 따른다.
- 테스트는 항상 **사용자 여정(User journey)** 우선, 구현 디테일 의존 최소화.
- 테스트 자동화 시 **앱 코드가 아니라 테스트 코드만** 수정한다.

---

## 📦 도구/버전
- 러너: Playwright `@playwright/test` (1.55+)
- Node.js 20+ 권장(프로젝트는 Node 24에서 검증), TypeScript 5+
- 브라우저: Chromium / WebKit (필수), Firefox(선택)
- 기본 설정: `playwright.config.ts` (웹 서버 자동 기동: `yarn dev`)
- Playwright Test Agents: planner / generator / healer 사용
- MCP: `@playwright/mcp` (IDE/에이전트에서 브라우저 제어용)

---

## 📂 디렉터리/아티팩트 규칙
- 사람이 작성하는 TODO 문서: `e2e/specs/{feature}/**.todo.md` (페이지/기능 단위, `[시나리오 N]` 단위 user journey)
- planner가 작성하는 Markdown 플랜: `specs/{feature}.md` (TODO 문서 기반, steps + expected results 분리, `Origin: planner-suggested` 메모로 추가 시나리오 명시)
- generator가 생성하는 테스트 코드: `e2e/tests/{feature}/**.spec.ts`
- specs/tests는 동일한 폴더 구조를 유지한다.
- 기존 Playwright 기본 `tests/` 디렉터리가 있으면 공존 가능, seed test(`tests/seed.spec.ts`)는 필수 입력으로 활용.

---

## 🤖 Agent 워크플로우
### Planner
- 입력: seed test(필수), TODO 문서/PRD/디자인(선택).
- seed test 실행 후 앱을 실제 탐색, TODO 시나리오를 steps/expected로 구조화한 Markdown 플랜을 `specs/*.md`에 작성.
- locator를 박지 말고 “무엇을 검증할지”만 기술. 테스트 코드는 생성하지 않는다.

### Generator
- 입력: planner 출력(`specs/*.md`), seed test, `playwright.config.ts`.
- 출력: `e2e/tests/**.spec.ts` Playwright TS 코드.
- 파일명: 기능+시나리오(`post-like-guest.spec.ts` 등), 테스트명은 TODO 시나리오 표현을 명확히 다듬어 사용.
- 라우트 하드코딩 금지 → constants 사용, 없으면 오류 메시지 남기고 실행 중단. `use.baseURL` 활용.
- 네비게이션 후 `waitForLoadState('networkidle')` 또는 주요 요소 가시성 확인. `waitForTimeout` 금지.
- Locator 우선순위: `getByTestId` → `getByRole` → `getByLabel` → `getByText` → `locator`(최후). 다른 로케이터 사용 시 `// locator-justification` 주석.
- Assertion: web-first `expect`, 동기 `expect`+`isVisible` 조합 금지. 중요/부수 결과는 hard/soft 적절히 구분.
- 로그인/권한: 기존 fixture/helper(예: `auth.fixtures.ts`) 우선 재사용, 없으면 재사용성 있는 이름으로 작성.
- 스크린샷/비디오/Trace: 실패 시 캡처(`screenshot/video/trace: retain-on-failure` 등) 설정 유지, Trace Viewer로 디버깅 안내.

### Healer
- 역할: 실패한 테스트를 재실행·분석 후 locator/타이밍/텍스트 등 테스트 코드만 수정해 치유.
- 동작: 실패 식별 → 재실행 및 스냅샷/콘솔/네트워크 조사 → 패치 제안/적용 → 재실행 결과 보고.
- 금지: 앱 구현 코드 수정, 의미 흐리는 느슨한 assertion, TODO/PRD 무시, 기능 깨졌는데 억지 통과시키기. 필요 시 `test.skip` 또는 TODO 메모 남김.

---

## 📁 폴더 구조 (기능 기준 + 전제 접미사)
기능(도메인)별 폴더만 만들고, **로그인/비로그인/공통 전제는 파일명 접미사로 구분**한다.

```text
e2e/
├── pages/                           # Page UI 테스트 (원하면 여기도 common 가능)
│   └── home/
│       ├── home.auth.spec.ts
│       ├── home.guest.spec.ts
│       └── home.common.spec.ts      # 선택: 페이지 레벨 공통
├── scenarios/                       # 사용자 플로우 테스트
│   └── like/
│       ├── like.auth.spec.ts
│       ├── like.guest.spec.ts
│       └── like.common.spec.ts      # ✅ 공통(권한 무관) 시나리오
├── fixtures/
│   └── auth/storage-state.json
└── playwright.config.ts
```

* **로그인 전제**: `*.auth.spec.ts`
* **비로그인 전제**: `*.guest.spec.ts`
* **공통 전제**: `*.common.spec.ts` 
* 파일명은 `기능.전제.spec.ts` 형식을 유지한다(예: `like.auth.spec.ts`).
* 파일 접미사: *.guest.spec.ts, *.auth.spec.ts, *.common.spec.ts
* 게스트 전용 프로젝트: (guest|common)만 매칭
* 인증 전용 프로젝트: (auth|common)만 매칭
* “전체” 실행은 모든 프로젝트


## ▶ 실행 명령 (package.json 기준)

- 전체: `yarn test:e2e`
- 게스트 시나리오만: `yarn test:e2e:guest`
- 인증 시나리오만: `yarn test:e2e:auth`
- UI 모드: `yarn test:e2e:ui`
- Headed: `yarn test:e2e:headed`
- 리포트: `yarn test:e2e:report`
- 코드 생성기(Codegen): `yarn codegen`


---

## 🌐 환경/시크릿

- 앱 기본 URL은 `.env`의 `BASE_URL`/`NEXT_PUBLIC_BASE_URL`에서 파생 (하드코딩 금지).
- 민감 정보는 환경변수로만 주입. `.env`는 커밋 금지, `.env.example`로 문서화.
- 로그인 테스트 계정 환경변수(권장): `E2E_TEST_EMAIL`, `E2E_TEST_PASSWORD`.
  - 하위 호환: `CYPRESS_TEST_EMAIL`, `CYPRESS_TEST_PASSWORD`도 인식(점진 전환).
- 인증 프로젝트(storage state 사용): `e2e/fixtures/auth/storage-state.json`
  - 생성 가이드(예): 로컬에서 로그인 후 `storageState`를 저장하는 스크립트를 실행하거나, 임시 스펙에서 `context.storageState({ path })` 호출.
- DB/외부 서비스는 최소 시드 원칙. 테스트 간 상태 공유 금지.

---

## ⚙ Playwright 설정 가이드

- 필수 브라우저: Safari(WebKit), Chrome(Chromium)
- 모든 시나리오는 최소 2개의 브라우저에서 병렬 실행한다.
- 추가 브라우저(Firefox 등)는 필요 시 CI matrix에 확장한다.

## 🧰 품질 점검(린트)

- 전체 린트: `yarn lint`
- 자동 수정: `yarn lint:fix`
- e2e 전용: 미사용 Playwright `request` 인자는 자동 삭제됨(자동 수정 필요).
- 미사용 인자/변수는 `_` 접두로 예외 허용(`_request` 등) — 꼭 필요한 경우에만 사용.

---

## 🔎 로케이터 우선순위 (TestID-First)

### 원칙

* 최우선으로 `getByTestId`를 사용한다.
* `getByTestId`가 없다면 해당 element에 중복되지 않도록 testId를 생성한다.
* 불가피하게 다른 로케이터(`getByRole`, `getByLabel`, `locator()` 등)를 쓸 경우 → **반드시 근거 주석**을 남긴다.

### 규칙

1. 모든 주요 상호작용 요소에는 `data-testid`를 부여한다.
2. 테스트 코드에서는 `page.getByTestId('<id>')`를 최우선으로 사용한다.
3. 다른 로케이터 사용 시 `// locator-justification: ...` 주석으로 이유를 설명한다.
4. CSS/XPath 단독 사용은 최후의 수단이다.

### TestID 네이밍 가이드

* **케밥케이스** 사용: `like-button`, `like-count`, `profile-save-button`
* **고유·의미 중심**: `btn1`, `item` 등 모호/중복 금지

### 예시

```ts
// ✅ 권장
await page.getByTestId('like-button').click();

// 허용 (근거 주석 필수)
// locator-justification: 접근성 레이블 검증 목적
await page.getByRole('button', { name: '좋아요' }).click();
```

---

## 🧪 테스트 작성 규칙
- **위치**: `e2e/specs/<기능>/<기능>.(auth|guest|common).spec.ts`
- **독립성**: 상태 공유 금지, 생성/삭제는 API/시드 유틸 활용, 잔여 상태 제거
- **동기화**: `waitForLoadState('networkidle')`, 웹-퍼스트 assertion 사용
- **금지**: 무의미한 `waitForTimeout`, 하드코딩 URL/시크릿
- **플레이크**: 원인 남기고 임시 격리(`test.fixme`), 7일 내 복구
- **태깅**: 제목 접두어로 `[smoke]`, `[slow]` 등 태그를 붙여 선택 실행을 지원한다.
- **사용자 관점**: DOM 내부 구조/DB에 과도 의존 금지, 사용자 행동/결과 중심 검증.
- **테스트 명/파일 명**: 무엇을 검증하는지 즉시 이해되게 작성.
- **독립성 확보**: 각 테스트가 로그인/시드 등 필요한 상태를 자체 준비. 반복 작업은 fixture/hook으로 추상화.
- **중복 허용**: 과도한 추상화로 가독성 해치지 말고, 필요 시 helper/fixture로 추상화.

---

## ✅ Definition of Done (E2E)

* [ ] 목적/사용자 행위가 제목에 드러남
* [ ] 가능한 곳에서 `getByTestId` 사용
* [ ] 다른 로케이터 사용 시 `locator-justification` 주석 있음
* [ ] 데이터 격리/정리 보장
* [ ] 전제별 파일 접미사 적용(`.auth`, `.guest`)
* [ ] 리포트/아티팩트 확인(trace/video/screenshot)
* [ ] CI에서 안정성 확보(retries/worker/리포터 구성)
* [ ] TODO 문서/PRD 요구사항을 충족했는지 검증 (없다면 보수적 TODO 주석으로 남김)

---

## 📌 운영 메모

* 기능 단위로 폴더를 구성하고 전제는 파일명 접미사로만 구분한다.
* `getByTestId` 중심으로 작성하여 안정성을 확보한다.
* 모든 테스트/리뷰/문서는 한글로 작성한다(코드 식별자는 영어 가능).
* 모호하면 사용자에게 질문하거나, 테스트 파일 상단에 `// TODO:`로 가장 보수적 가정을 남긴다.
