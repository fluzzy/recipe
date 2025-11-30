# Playwright 테스트 `request` 자동 삭제 및 린트 범위 보강

## 배경/문제

- e2e 테스트에서 Playwright 테스트 함수의 구조분해 인자 `request`를 사용하는 경우가 드물어, 미사용 시 자동으로 제거하고 싶음.
- 기존 `yarn lint`가 `next lint`만 실행하여 `e2e/**`는 검사 대상이 아니었고, 자동 수정(`--fix`)도 수행되지 않아 기대한 정리가 일어나지 않았음.

## 목표(명확 지표)

- `yarn lint:fix` 실행 시 e2e 테스트 파일 내 미사용 `request` 파라미터가 자동 제거됨.
- `yarn lint`가 실제 ESLint Flat Config를 로드해 설정 오류(존재하지 않는 import 등)를 즉시 검출.

## 범위/비범위

- In: ESLint 설정(`eslint.config.mjs`) 보강, 로컬 규칙(플러그인) 추가/유지, NPM 스크립트 정비.
- Out: 외부 의존성 추가(승인 필요), 대규모 테스트 리팩터링.

## 설계 개요

1. 로컬 ESLint 규칙 유지(자동 수정)
   - 파일: `eslint/plugins/playwright-fixers.mjs` 추가(또는 유지).
   - 규칙: `playwright-fixers/remove-unused-request-param` — e2e 테스트 파일에서 미사용 `request` 인자를 자동 제거(fixable)하도록 함.

2. ESLint 설정 업데이트
   - e2e 전용 override 추가: `files: ['e2e/**/*.spec.ts', 'e2e/**/*.test.ts']`에 위 규칙을 `error`로 적용.
   - TS: `@typescript-eslint/no-unused-vars`를 `error`로 상향, `_` 접두 인자/변수는 허용(`argsIgnorePattern`, `varsIgnorePattern`).
   - JS/MJS: 설정 파일 등에도 미사용 변수 오류 적용(`no-unused-vars: error`).

3. 스크립트 정비
   - `lint`: `tsc && eslint . --ext .ts,.tsx,.js,.mjs`로 변경하여 Flat Config를 직접 로드(설정 import 문제 즉시 검출).
   - `lint:fix`: `eslint . --ext .ts,.tsx,.js,.mjs --fix` 추가(자동 수정 실행용).

## 리스크 & 완화

- 자동 수정은 `eslint --fix` 실행 시에만 적용 → `yarn lint:fix` 제공 및 팀 가이드 반영.
- 로컬 규칙 유지에 따른 관리 비용 → 적용 범위를 e2e에 한정하고, 단일 목적 규칙으로 단순화.

## 테스트 전략

- 로컬: `yarn lint`로 설정 로드 검증, `yarn lint:fix`로 e2e 파일 `request` 자동 제거 동작 확인.
- CI: `lint` 단계에서 `tsc` + `eslint` 실행(필요 시 `lint:fix`는 로컬 전용 권장).

## 일정/마일스톤

- 착수–PR: 0.5d, 리뷰: 0.5d, 머지: 즉시

## 승인

- 승인자: @reviewer1 @reviewer2
- 상태: 승인 대기
