# 접근성 규칙 (Frontend a11y)

---

agent_spec: v1  
doc: accessibility  
scope: repo  
precedence: 130  
language: ko

---

이 문서는 프론트엔드 접근성(a11y) 규칙을 정의합니다. 모든 React/TypeScript 코드 편집 시 적용합니다.

---

## 1. 기본 원칙 – 역할(Role) · 레이블(Label) · 상태(State)

- 시맨틱 태그를 우선 사용: `<button>`, `<a>`, `<input>`, `<form>`, `<fieldset>`, `<legend>`, `<dialog>`, `<details>`, `<summary>` 등. 시맨틱으로 표현이 안 되면 `role`을 명시(예: `tablist`, `tab`, `tabpanel`, `dialog`, `checkbox`, `radio`, `switch`, `button`, `region` 등).
- 모든 인터랙티브 요소는 이름을 가져야 함: 우선순위 `aria-labelledby` → `aria-label` → `<label>`/요소 텍스트. 아이콘-only 버튼/스위치/토글은 `aria-label` 또는 `aria-labelledby` 필수.
- 상태 동기화: HTML 기본 속성과 ARIA 상태 속성을 항상 맞춤 (`checked`/`aria-checked`, `selected`/`aria-selected`, `open`/`aria-expanded`, `disabled`/`aria-disabled`, `aria-current` 등).
- 커스텀 인터랙티브 요소는 `tabIndex={0}` + `role` + `onKeyDown`에서 Enter/Space 처리.
- 색/아이콘/이미지에만 의존 금지. 텍스트 또는 ARIA 레이블로 보완. 장식 이미지는 `alt=""`.

## 2. 라이브 리전(Live Region)

- 동적 콘텐츠에 `aria-live` 사용: 일반 업데이트 `polite`, 긴급 알림 `assertive`.
- `role="alert"`(assertive+atomic), `role="status"`(polite+atomic) 활용.
- 로딩 시 `aria-busy`로 알림 보류, `aria-atomic`은 전체 영역 낭독 여부 제어.

## 3. UI 컴포넌트별 규칙

- 탭: `tablist` 컨테이너 + `aria-label`/`aria-labelledby`, 탭은 `role="tab"` + `aria-selected`, 패널은 `role="tabpanel"` + `id`. 탭 버튼 `aria-controls` ↔ 패널 `aria-labelledby` 연결. 활성 패널만 표시, `aria-selected`와 표시 동기화. 좌/우 방향키 이동 지원.
- 아코디언: 가능하면 `<details>`/`<summary>`. 커스텀 시 헤더 `<button>` + `aria-expanded` + `aria-controls`, 패널 `role="region"` + `aria-labelledby` + `hidden={!isOpen}`. 상태 동기화 필수.
- 모달: `<dialog>` 우선(`aria-haspopup="dialog"`, `showModal/close`, 제목은 `aria-labelledby`/`aria-label`). 커스텀 시 `role="dialog"` + `aria-modal="true"` + 제목, 포커스 진입/복귀, ESC 닫기, 백그라운드 `inert`, 포커스 트랩.
- 라디오: 기본 `<fieldset>` + `<legend>` + `<input type="radio" name="...">` + `<label>`. 대안: `role="radiogroup"` + `aria-labelledby`. 동일 그룹 name 동일. 커스텀 라디오는 `role="radio"` + `aria-checked` + `tabIndex={0}` + Space 처리, 그룹에 `role="radiogroup"`.
- 체크박스: 기본 `<fieldset>` + `<legend>` + `<input type="checkbox">` + `<label>`. 커스텀은 `role="checkbox"` + `aria-checked` + `tabIndex={0}` + Space 처리.
- 스위치: `<input type="checkbox" role="switch" checked={isOn}>` + 레이블. 커스텀은 `role="switch"` + `aria-checked` + `tabIndex={0}` + Space 처리 + 레이블 필수(무엇을 켜는지 명시).

## 4. 실전 패턴

- 버튼/링크 중첩 금지 (`<button>` 안 `<button>`/`<a>` 등). 필요 시 폴리모픽 버튼(`as="a"`) 또는 카드 전체 클릭 패턴 사용.
- 테이블 행 클릭 금지. 행 안에 실제 `<a>`를 넣고 CSS로 영역 확장.
- 인터랙티브 요소 이름 부여: 입력은 `<label>`+`id` 우선, 없으면 `aria-label`/`aria-labelledby`. 아이콘 버튼은 `aria-label` 필수. placeholder는 레이블 대체 X.
- 같은 이름 버튼 반복 시 맥락 텍스트와 연결(`aria-labelledby` 또는 구체적 `aria-label`).
- 역할과 동작 일치: 단순 `<div onClick>` 금지, 가능하면 `<button>`. 불가 시 `role="button"` + `tabIndex={0}` + Enter/Space 처리.
- 입력 그룹은 `<form>` 내부, submit 버튼은 `type="submit"`, 일반 버튼은 `type="button"` 명시. 폼 밖 submit은 `form="form-id"`.
- 이미지/아이콘 alt: 정보/기능 기준으로 작성, 장식은 `alt=""`, 불필요 단어 제거, 맥락 기반.

## 5. eslint-plugin-jsx-a11y 최소 규칙

- 필수: `alt-text`, `control-has-associated-label`, `no-noninteractive-element-interactions`, `no-noninteractive-element-to-interactive-role`, `no-noninteractive-tabindex`, `tabindex-no-positive`.
- 디자인 시스템/폴리모픽 연동 시 `settings.jsx-a11y.components`와 `polymorphicPropName: "as"` 설정 고려, 필요한 커스텀 label prop은 `labelAttributes`로 지정.

## 6. 새 컴포넌트 체크리스트

1. 역할: 시맨틱 태그/role 명시 여부.
2. 레이블: 모든 인터랙티브 요소 이름 보유 여부.
3. 상태: HTML/ARIA 상태 동기화.
4. 키보드: Tab/Enter/Space/방향키 조작 가능 여부.
5. 시각 의존성: 색/아이콘-only 금지, 대체 텍스트/레이블 제공.
6. eslint-plugin-jsx-a11y 규칙 위반 여부 확인.
