# 프로젝트 에이전트 규칙 (Global)

---
agent_spec: v1  
doc: global-rules  
scope: repo  
precedence: 100  
language: ko  
---

이 문서는 레포 전체에서 **에이전트(코드 도우미)** 가 반드시 따라야 할 **기본 규칙**을 정의합니다.  
세부 영역별 규칙은 `.codex/agents/` 폴더의 문서에서 정의하며, 이 문서는 **단일 출처(Single Source of Truth)** 로 사용됩니다.


---

## ⚖️ 우선순위 및 충돌 해결
- 규칙 문서마다 `precedence` 값을 둡니다. **값이 높을수록 우선합니다.**  
- Global 규칙보다 영역별 규칙(예: Testing)이 우선합니다.  
- 규칙 간 충돌·애매함 발생 시 **진행 전 반드시 질문**합니다.

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

> 모든 변경은 “요청된 작업 범위” 내에서만 진행하며, 무관한 수정을 하지 않습니다.

---

## 🌐 도구 및 환경
- **패키지 매니저**: yarn  
- **프레임워크**: Next.js (App Router)  
- **DB**: Prisma (PostgreSQL). 마이그레이션은 `yarn schema`  
- **E2E**: Playwright  
  - 실행: `yarn test:e2e`, `yarn test:e2e:ui`  
  - 리포트: `yarn test:e2e:report`

---

## 💻 코딩 표준
- TypeScript 우선, `any` 사용은 근거 필요  
- ESLint + Prettier + import 정렬 유지 (불필요한 스타일 변동 금지)  
- 명확하고 의미 있는 변수명, 1글자 변수 지양  
- 변경은 **최소·국소화**, 기존 스타일과 일관 유지  

### 포매팅(Prettier 규칙 준수)
- 포매팅은 Prettier 출력이 단일 진실(SSOT)이다. Prettier 경고/에러가 나오면 코드를 Prettier가 요구하는 형태로 고친다.
- 트레일링 콤마: 가능하면 모두 사용(trailingComma: all) — 멀티라인 파라미터/객체/배열에 콤마 유지.
- 긴 파라미터/구조분해는 줄바꿈하여 가독성을 확보한다.
- Prettier와 ESLint 충돌 시 `eslint-config-prettier` 기준으로 Prettier 우선.
- 변경 후 `yarn prettier` 또는 에디터 포맷 온 세이브를 통해 포매팅을 유지한다.

---

## ✅ 린트/품질 게이트
- **린트 에러가 발생하면 반드시 수정한다.** 에러가 해결될 때까지 커밋/PR을 진행하지 않는다.  
- `eslint-disable` 류 주석은 **예외 사유를 주석으로 명시**하고, PR 설명에도 근거를 남긴다.  
- CI에서 **lint / type-check / test** 중 하나라도 실패하면 병합 금지.
 - 모든 변경의 마지막에 `yarn lint`을 실행하여 e2e 포함 전역에 대해 ESLint/Prettier를 확인한다. (로컬 IDE 포맷이 기준과 다를 수 있으므로 스크립트 기준으로 재검증)

---

## 📝 기능 개발 플로우(Plan-First)
- **새 기능/변경 작업은 반드시 `plan.md`를 먼저 만든 뒤 승인 후 실행한다.**
  - 위치: `docs/plans/<feature-name>.plan.md`
  - 승인자: 코드오너 또는 지정 리뷰어(팀 규칙 참조)
  - 승인 전에는 구현 PR을 올리지 않는다.

### plan.md 템플릿
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

## ⚛️ Next.js 가이드라인
- Server Component 우선, 필요한 경우에만 `"use client"` 사용  
- 클라이언트 요청은 `~/lib/http` 모듈 사용  
- URL은 `.env`의 `BASE_URL`, `NEXT_PUBLIC_BASE_URL` 참조 (하드코딩 금지)  
- API 라우트는 **일관된 타입/에러 형식**으로 응답  

---

## 🗄 DB 규칙
- 스키마 변경: `prisma/schema/*` 수정 후 `yarn schema` 실행  
- 파괴적 변경은 **사전 승인 필수**  
- 데이터 마이그레이션 전략을 반드시 명시  

---

## 🧪 테스트 원칙
- 주요 사용자 경로(`home`, `search`, `auth`)는 반드시 E2E로 검증  
- 세부 지침은 `.codex/agents/testing.md` 참조  
- 테스트는 빠르고 독립적이어야 하며, 외부 의존성은 최소화  

---

## 🔒 보안 및 샌드박스
- 승인 필요: 네트워크 설치, 포트 바인딩, 대규모 삭제 등  
- 비밀/토큰은 절대 커밋 금지 → `.env.example` 에만 문서화  

---

## 🗣 커뮤니케이션 원칙
- **대화는 한글로만 한다.**  
  - 이슈/PR/코멘트/에이전트 로그/문서 모두 한글 사용  
  - 코드 식별자(변수/함수명)는 영어 유지 가능하나, 주석/설명은 한글 권장  
- 여러 명령 실행 시 **프리앰블**로 행동 요약 후 진행  
- 복합 작업은 **TODO 계획을 간단히 공유**  
- 한 번에 하나의 단계만 활성 진행 상태로 유지  

## 📝 커밋 규칙
- 커밋 메시지는 Conventional Commits 형식 사용:
  - feat: 새로운 기능
  - fix: 버그 수정
  - chore: 설정/빌드/agents 변경
  - docs: 문서 수정
  - test: 테스트 관련

## ✅ Global Definition of Done
- [ ] lint / type-check / test / build 모두 통과
- [ ] 신규 기능에는 테스트(E2E 또는 단위)가 포함됨
- [ ] 문서(plan.md 또는 README)가 업데이트됨
- [ ] 보안/비밀 데이터가 노출되지 않음

## 🚀 CI/CD 원칙
- CI는 다음 순서를 따른다: install → lint → type-check → test → build
- CI 어느 단계라도 실패하면 merge 불가
