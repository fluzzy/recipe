# 프로젝트 에이전트 규칙 (Global)

---

agent_spec: v1  
doc: global-rules  
scope: repo  
precedence: 100  
language: ko

---

이 문서는 레포 전체에서 **에이전트(코드 도우미)** 가 따라야 할 기본 규칙입니다.  
세부 규칙은 `.codex/agents/*.md` 와 `.cursor/rules/*.mdc` 의 내용을 진실로 삼고, 본 문서는 그 규칙들의 **요약·결합본**입니다.

---

## 📚 규칙 출처 & 계층

### 규칙 파일 구조

- **`.cursor/rules/*.mdc`**: Cursor가 자동으로 적용하는 규칙 파일 (파일 glob 기준)
  - `accessibility.mdc` - 접근성 규칙 (시맨틱 태그, ARIA, 키보드 탐색)
  - `frontend-quality.mdc` - 프론트엔드 코드 품질 규칙 (가독성, 예측 가능성, 응집도, 결합도)
  - `e2e.mdc` - E2E 테스트 규칙 (Playwright Test Agents, Functional POM)
  - `agents-rule-of-two.mdc` - AI 에이전트 보안 프레임워크 (Meta Agents Rule of Two)
  - `stack-auth.mdc` - Stack Auth 설정 및 사용 가이드
  - `neon-auth.mdc` - Neon Auth 데이터 동기화 규칙

- **`.codex/agents/*.md`**: 도메인별 세부 철학 문서 (에이전트가 참조해야 할 상세 가이드)
  - `frontend-quality.md` - 프론트엔드 코드 품질 철학 (TOSS Frontend Fundamentals 기반)
  - `accessibility.md` - 접근성 철학 및 가이드
  - `testing.md` - E2E 테스트 철학 (Playwright Test Agents 워크플로우)
  - `agents-rule-of-two.md` - Agents Rule of Two 보안 프레임워크 상세 가이드

- **`AGENTS.md`**(본 문서): 위 두 계층을 요약하며 **precedence 100**이다.  
  `.codex/agents`(pre 115~130) 및 `.cursor/rules`가 상위 규칙이므로, 충돌 시 상위 규칙을 우선 적용한다.

### 규칙 적용 우선순위

1. **작업 시작 전**: 관련 `.codex/agents/*.md` 철학 문서를 먼저 읽어 전체 맥락을 이해한다.
2. **코드 작성 중**: `.cursor/rules/*.mdc` 규칙이 자동으로 적용되며, 필요 시 해당 파일을 참조한다.
3. **충돌 발생 시**: 상위 규칙(`.codex/agents` 또는 `.cursor/rules`)을 우선 적용하고, 애매한 경우 **진행 전 질문**한다.

---

## 🛠 의사결정 원칙

**사전 승인 필요**

- DB 스키마 변경
- 의존성 추가/제거
- 공개 API 스펙 변경
- 대규모 파일 삭제/이동
- 빌드·배포 파이프라인 수정

**자율적으로 수행 가능**

- 소규모 리팩터링
- 관련 테스트/타입 보완
- 누락된 내보내기, 경로 수정
- 문서 보완

> 모든 변경은 “요청된 작업 범위” 내에서만 수행한다.

---

## 🌐 도구 및 환경

- **패키지 매니저**: yarn
- **프레임워크**: Next.js (App Router)
- **DB**: Prisma (PostgreSQL) — 마이그레이션은 `yarn schema`
- **E2E**: Playwright (`yarn test:e2e`, `yarn test:e2e:ui`, `yarn test:e2e:report`)

---

## 💻 코딩 표준

- TypeScript 우선, `any` 사용 시 사유 명시.
- ESLint + Prettier + import 정렬 유지, 의미 있는 변수명 사용.
- 변경은 최소·국소화, 기존 스타일과 일관 유지.

### 프론트엔드 코드 품질

- 프론트엔드 작업 시 `.codex/agents/frontend-quality.md` + `.cursor/rules/frontend-quality.mdc` 의 4원칙을 반드시 따른다:
  - **가독성**: 맥락을 작게 유지, 같이 실행되지 않는 코드 분리, 구현 상세 추상화
  - **예측 가능성**: 일관된 이름과 반환 타입, 숨은 부작용 방지
  - **응집도**: 함께 변경되는 것들을 가까이 두기, 도메인별 폴더 구조
  - **결합도**: 변경의 영향을 제어, 책임을 하나씩 관리, 중복 코드 허용

### 접근성 (a11y)

- 접근성 관련 작업은 `.codex/agents/accessibility.md` 와 `.cursor/rules/accessibility.mdc` 를 최우선으로 따른다:
  - 시맨틱 태그 우선 사용, `role` 명시
  - 모든 인터랙티브 요소에 레이블 제공 (`aria-label`, `aria-labelledby`, `<label>`)
  - 상태 속성 동기화 (`checked`/`aria-checked`, `open`/`aria-expanded` 등)
  - 키보드 탐색 지원 (Tab, Enter, Space, 방향키)
  - 라이브 리전 사용 (`aria-live`, `role="alert"`, `role="status"`)

### 인증 및 데이터베이스

- Stack Auth/Neon Auth 관련 작업은 `.cursor/rules/stack-auth.mdc` 및 `.cursor/rules/neon-auth.mdc` 의 설치/SDK/데이터-동기화 지침을 선행 검토한다.

### 포매팅(Prettier 규칙 준수)

- 포매팅은 Prettier 출력이 단일 진실(SSOT)이다. 경고/에러 발생 시 Prettier 요구 형태로 수정.
- 트레일링 콤마를 가능한 모두 사용(trailingComma: all).
- 긴 파라미터/구조분해는 줄바꿈으로 가독성 확보.
- Prettier vs ESLint 충돌 시 `eslint-config-prettier` 기준으로 Prettier 우선.
- 변경 후 `yarn prettier` 또는 에디터 포맷 온 세이브로 일관성 유지.

---

## ✅ 린트/품질 게이트

- **코드를 수정한 후에는 반드시 `yarn lint`를 실행해 검증한다.** 오류가 있다면 원인을 해결한 뒤 다시 `yarn lint`를 돌려 깨끗한 상태를 확인한다.
- 린트 에러가 단 하나라도 남아 있으면 커밋/PR 금지.
- `eslint-disable` 류 주석은 필요한 최소 범위에만 사용하고, 예외 사유를 코드/PR에 명시한다.
- CI에서 lint/type-check/test 중 하나라도 실패하면 병합 금지.

---

## 📝 기능 개발 플로우 (Plan-First)

- 새 기능/변경 작업은 반드시 `docs/plans/<feature-name>.plan.md` 를 생성해 승인받은 후 구현을 시작한다.
- plan.md 템플릿:

```md
# <기능 이름>

## 배경/문제

- (왜 필요한가? 사용자/업무 관점)

## 목표(명확 지표)

- (예: TTI 20% 개선, 전환율 +2pp)

## 범위/비범위

- In: ...
- Out: ...

## 설계 개요

- 아키텍처/데이터흐름/주요 모듈

## 리스크 & 완화

- (의존성, 마이그레이션, 롤백 전략 등)

## 테스트 전략

- 단위/통합/E2E 포인트

## 일정/마일스톤

- (착수–리뷰–릴리즈)

## 승인

- 승인자: @reviewer1 @reviewer2
- 상태: 승인 대기/승인됨
```

---

## ⚛️ Next.js 가이드라인

- Server Component 우선, 필요한 경우에만 `"use client"`.
- 클라이언트 요청은 `~/lib/http` 모듈 사용, URL은 `.env`의 `BASE_URL`, `NEXT_PUBLIC_BASE_URL`을 참조(하드코딩 금지).
- API 라우트는 통일된 타입/에러 형식을 유지한다.

---

## 🗄 DB 규칙

- 스키마 변경 시 `prisma/schema/*` 수정 후 `yarn schema` 실행.
- 파괴적 변경은 사전 승인 필수, 데이터 마이그레이션 전략 명시.
- Auth 연동 시 `.cursor/rules/neon-auth.mdc` 의 `neon_auth.users_sync` 테이블을 직접 수정하지 말고, 외래키는 앱 테이블 → `neon_auth.users_sync(id)` 방향으로만 건다.

---

## 🧪 테스트 원칙

- 주요 사용자 경로(`home`, `search`, `auth`)는 반드시 E2E로 검증한다.
- `.codex/agents/testing.md` 및 `.cursor/rules/e2e.mdc` 의 Playwright Test Agents 흐름(planner → generator → healer)과 TestID-first 규칙을 따른다.
- **Functional Page Object Model (POM)** 사용: 클래스 대신 무상태 함수로 페이지 동작을 설계한다.
- **Robust Click Strategy**: 클릭 실패에 내성을 넣기 위해 4단계 폴백 전략을 사용한다.
- 테스트는 빠르고 독립적으로 유지하고, 외부 의존성은 최소화한다.

---

## 🔒 보안 및 샌드박스

- **Agents Rule of Two**: AI 에이전트 설계 시 `.codex/agents/agents-rule-of-two.md` 및 `.cursor/rules/agents-rule-of-two.mdc` 를 반드시 참고한다.
  - 세 가지 속성([A] 신뢰할 수 없는 입력, [B] 민감한 데이터, [C] 상태 변경/외부 통신) 중 최대 두 가지만 허용.
  - 세 가지가 모두 필요한 경우 새로운 세션 또는 인간 감독 메커니즘 도입.
- 네트워크 설치, 포트 바인딩, 대규모 삭제 등은 승인 필요.
- 비밀/토큰은 커밋 금지. 필요한 값은 `.env.example` 에만 문서화.

---

## 🗣 커뮤니케이션 원칙

- 모든 대화·문서는 한글로 작성(코드 식별자는 영어 가능, 주석은 한글 권장).
- 여러 명령 실행 시 프리앰블로 행동 요약 후 진행.
- 복합 작업은 TODO 계획을 공유하고, 동시에 하나의 단계만 진행 상태로 유지.

---

## 📝 커밋 규칙

- Conventional Commits 사용:
  - feat: 새로운 기능
  - fix: 버그 수정
  - chore: 설정/빌드/agents 변경
  - docs: 문서 수정
  - test: 테스트 관련

---

## ✅ Global Definition of Done

- [ ] lint / type-check / test / build 모두 통과
- [ ] 신규 기능에는 테스트(E2E 또는 단위)가 포함됨
- [ ] 문서(plan.md, README 등) 최신화
- [ ] 보안/비밀 데이터 노출 없음

---

## 🚀 CI/CD 원칙

- CI 순서: install → lint → type-check → test → build.
- 어느 단계라도 실패하면 merge 금지.
