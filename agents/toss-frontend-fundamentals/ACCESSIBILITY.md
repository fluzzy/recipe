# ACCESSIBILITY – Accessibility Guide

The goal of accessibility (a11y) in this project is to create **UI where "Role · Label · State" are always clear**.

The guidelines below are common rules that both humans and AI must follow when writing and refactoring components.

---

## 1. Basic Accessibility Principles

### 1-1. Role

- Use **semantic tags** first whenever possible.

  - `<button>`, `<a>`, `<input>`, `<form>`, `<fieldset>`, `<legend>`, `<dialog>`, `<details>`, `<summary>`, etc.

- If semantic tags cannot express the intended meaning, use `role` explicitly.

  - Example: `role="tablist" | "tab" | "tabpanel" | "dialog" | "checkbox" | "radio" | "switch" | "button" | "region"`, etc.

### 1-2. Label

- All **interactive elements** (buttons, links, inputs, select components, etc.) must always have a name that describes "what it is".
- Priority: `aria-labelledby` → `aria-label` → `<label>`/element text.
- If visual text sufficiently describes the meaning, ARIA can be omitted.
- **Icon-only buttons / switches / toggles** must have a required label via `aria-label` or `aria-labelledby`.

### 1-3. State

- State should use both **HTML native attributes** and **ARIA state attributes**, but always keep them synchronized.
- Common attributes

  - `checked` / `aria-checked`
  - `selected` / `aria-selected`
  - `open` / `aria-expanded`
  - `disabled` / `aria-disabled`
  - `aria-current` (current page/date, etc.)

### 1-4. Live Region

Live regions are used to inform screen readers about dynamically changing content:

- **`aria-live`**: Screen reader announces content changes

  - `aria-live="polite"`: Announces after current speech finishes (general updates)
  - `aria-live="assertive"`: Announces immediately (urgent errors, critical alerts)

- **`role="alert"`**: Equivalent to `aria-live="assertive"` + `aria-atomic="true"`. Use for error messages and urgent alerts.

- **`role="status"`**: Equivalent to `aria-live="polite"` + `aria-atomic="true"`. Use for status updates and success messages.

- **`aria-busy`**: Indicates content is loading. When `true`, screen reader defers change announcements.

- **`aria-atomic`**: When `true`, reads the entire region, not just the changed portion.

Example:

```tsx
// Form submission result notification
<div role="status" aria-live="polite">
  {submitSuccess && "Saved successfully."}
</div>

// Error message
<div role="alert">
  {errorMessage}
</div>

// Loading state
<div aria-busy={isLoading} aria-live="polite">
  {isLoading ? "Loading..." : content}
</div>
```

### 1-5. Keyboard Navigation

- Make UI operable using Tab/Shift+Tab, Enter, Space, and arrow keys.
- **For custom interactive elements**:

  - Add `tabIndex={0}`
  - Set `role`
  - Handle Enter / Space in `onKeyDown`

### 1-6. Don't Rely on Visual Information Alone

- Information must not be conveyed through color/icons/images alone.
- Always supplement with **text or ARIA labels**.
- Decorative images without meaning should use `alt=""` to prevent reading by screen readers.

---

## 2. UI Component Rules

### 2-1. Tab

**Goal:** Enable screen readers to accurately understand the "tab list / current tab / corresponding panel" structure.

- Structure

  - Tab list container: `role="tablist"` + `aria-label` or `aria-labelledby`
  - Tab button: `role="tab"`

    - Current tab: `aria-selected="true"`
    - Other tabs: `aria-selected="false"`

  - Tab panel: `role="tabpanel"`

    - `id` required
    - `aria-controls="<tabpanel-id>"` on tab button
    - `aria-labelledby="<tab-id>"` on tab panel

- Show/Hide

  - **Only active panel** should be visibly rendered; hide others with `hidden` or `aria-hidden`/CSS.
  - Always synchronize `aria-selected` value with **panel visibility**.

- Keyboard

  - Implement arrow keys (left/right) for tab navigation as the standard approach.
  - Tab/Shift+Tab should be used to enter/exit the entire tab group.

### 2-2. Accordion

**Goal:** Make it clear which items are expanded.

- **Prefer using HTML standard elements** when possible

  - `<details>` + `<summary>`

    - Express state with `open` attribute
    - Manage state with `onToggle`

- Rules for custom implementation

  - Header (toggle button)

    - Use `<button>`
    - `aria-expanded={isOpen}`
    - `aria-controls="<panel-id>"`

  - Panel

    - `id="<panel-id>"`
    - `role="region"`
    - `aria-labelledby="<button-id>"`
    - `hidden={!isOpen}`

- State synchronization

  - `aria-expanded="true"` ↔ Panel visible
  - `aria-expanded="false"` ↔ Panel hidden
    → These must always match.

### 2-3. Modal/Dialog

**Goal:** When a modal is open, **keep user focus and screen reader attention only within the modal**.

- When `<dialog>` is available (preferred)

  - Trigger button: `aria-haspopup="dialog"`
  - Open with `dialog.showModal()`
  - Close with `dialog.close()`
  - Provide title via `aria-labelledby` or `aria-label`
  - Browser automatically:

    - Moves focus into modal
    - Traps focus
    - Closes on ESC
    - Returns focus to original element when closed

- When `<dialog>` cannot be used (custom modal)

  - Modal container

    - `role="dialog"`
    - `aria-modal="true"`
    - `aria-labelledby="<title-id>"` or `aria-label="..."`

  - Focus management

    - When modal opens: move focus to first focusable element inside
    - When modal closes: return focus to trigger element

  - ESC handling

    - Close on `keydown` when `e.key === "Escape"`

  - Background content

    - Add `inert` to main area when modal is open
    - Remove `inert` when modal closes

  - Focus trap

    - Use Tab/Shift+Tab to cycle focus only within modal.

### 2-4. Radio Button

**Goal:** Clarify the "select one answer from multiple options for a single question" structure.

- Basic structure (recommended)

  - Container: `<fieldset>`
  - Group title: `<legend>`
  - Each option:

    - `<input type="radio" name="...">`
    - `<label htmlFor="...">Option name</label>`

- Alternative structure

  - If `<fieldset>` cannot be used:

    - Container: `role="radiogroup"` + `aria-labelledby="<heading-id>"`
    - Internals still use `<input type="radio" name="..."> + <label>`

- Required rules

  - **Same group must have same `name`** (browser ensures "only one selected").
  - **Each option must always be connected to a label** (`id` + `htmlFor`).

- Custom radio (without input)

  - Each option:

    - `role="radio"`
    - `aria-checked={true|false}`
    - `tabIndex={0}` (at least one)
    - Space key toggles selection (handled in `onKeyDown`)

  - Group:

    - `role="radiogroup"` + `aria-labelledby`

### 2-5. Checkbox

**Goal:** Clarify option groups where multiple selections can be made simultaneously.

- When there is a group

  - Container: `<fieldset>`
  - Title: `<legend>`
  - Each item:

    - `<input type="checkbox" id="..." />`
    - `<label htmlFor="...">Text</label>`

- Custom checkbox

  - `role="checkbox"`
  - `aria-checked={true|false}`
  - `tabIndex={0}`
  - Check/uncheck with Space key (handled in `onKeyDown`)

### 2-6. Switch

**Goal:** Clearly convey on/off state.

- HTML-based switch

  - `<input type="checkbox" role="switch" checked={isOn} />`
  - Label:

    - Wrap with `<label>` or
    - Provide via `aria-label` / `aria-labelledby`

- Custom switch

  - `role="switch"`
  - `aria-checked={isOn}`
  - `tabIndex={0}`
  - Space key changes state
  - Label required

    - Describe "what is being turned on/off" (e.g., `"Dark mode"`, `"Notification settings"`)

---

## 3. Practical Pattern Rules

### 3-1. Don't Nest Buttons/Links Inside Buttons

- Forbidden

  - `<button>` inside `<button>`
  - `<button>` inside `<a>`
  - `<a>` inside `<button>`

- Solution

  - Use **polymorphic button** pattern

    - `<Button as="a" href="/...">Text</Button>`

  - Use "clickable card + internal individual buttons" pattern

    - Outer wrapper `div` + pseudo-transparent button for entire area click
    - Individual buttons as separate actual `<button>` elements
    - Focus styling with `.wrapper:focus-within { … }`

### 3-2. Don't Make Table Rows Directly Clickable

- Forbidden

  - `<tr onClick={...}>`

- Solution

  - Put actual **`<a>` link** inside row and expand area with CSS

    - Link with `position: relative` + `::after { position: absolute; inset: 0; content: "" }`

  - Benefits

    - Maintains native features like keyboard focus, context menu (open in new tab, copy link)
    - Recognized as "link" by screen readers

### 3-3. Name Interactive Elements

- Basic rule

  - All input/button/select elements **must always have a name**.

- Input fields

  - Prefer `<label for="id">` + `<input id="id">`
  - If visual label is not possible, use `aria-label`
  - Use `aria-labelledby` when reusing surrounding text

- Buttons/Icons

  - For text buttons, internal text serves as label
  - For icon buttons, `aria-label` is required

- Select

  - Basic structure: `<label>` + `<select id="...">`

- Placeholder

  - **Not a label replacement**, use only as hint
  - Always use together with a label

### 3-4. Multiple Buttons with Same Name

- Example: "Select" button repeated for each list item
- Rule

  - Create "context text" for each item and connect it to button
  - Pattern example:

    - List item: `<li aria-labelledby="title-id">`
    - Title text: `<div id="title-id">When using paper</div>`
    - Button: `id="paper-button" aria-labelledby="title-id paper-button"`

  - Or make button more specific with `aria-label="Select when using paper"`

### 3-5. Align Button Role with Behavior

- Forbidden

  - Simple `<div onClick>` with just `cursor: pointer` acting as button

- Basic

  - Always use `<button>` when possible.

- If must use `<div>`, etc.:

  - `role="button"`
  - `tabIndex={0}`
  - Handle Enter / Space in `onKeyDown`

### 3-6. Always Wrap Input Elements in `<form>`

- Basic

  - Put related input groups inside `<form>`.
  - Submit button should be `<button type="submit">`.
  - Buttons used only for clicking **must explicitly** specify `type="button"`.

- Behavior

  - When handling in JS:

    - Call `event.preventDefault()` in `onSubmit` before executing logic.

  - For screen readers:

    - Provide form name via `aria-label` or `<form aria-labelledby="...">`

- Submit button outside form

  - Connect button with `form="form-id"` attribute.

- Secondary buttons (delete input value, etc.)

  - Exclude secondary buttons from focus order with `tabIndex="-1"`, and describe role with `aria-label`.

### 3-7. Image / Icon Alternative Text (alt)

- Principle

  - Write alt based on "What **information** or **functionality** is this image trying to convey to the user?"

- When alt is required

  - When image is **the only content** of link/button → describe functionality in alt
  - When containing **core information** like product/graph/chart → summarize content

- When alt should be empty (`alt=""`)

  - Decorative images (simple dividers, backgrounds, etc.)
  - When surrounding text/captions already explain the same content
  - Icons accompanying text (delete icon + "Delete" text, etc.)

- Writing approach

  - Remove unnecessary words (`icon`, `button`)

    - Screen reader adds "button" anyway.

  - Write based on context

    - `"Go to previous page"`, `"Go to next page"`, etc. based on functionality/intent

---

## 4. eslint-plugin-jsx-a11y Configuration

Essential rules to enable for automatically catching accessibility violations in JSX/React code.

### 4-1. Basic Configuration

```ts
// eslint.config.js (flat config example)
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      "jsx-a11y/control-has-associated-label": "error",
      // Add/adjust other rules explicitly as needed
    },
  },
];
```

### 4-2. Key Rules Summary

- `alt-text`

  - `<img>` must always have `alt`.
  - Decorative images without information: `alt=""`.
  - Icons with text: `alt=""` recommended.

- `control-has-associated-label`

  - All controls (input, button, select, etc.) must have associated label.
  - Form-related markup should implement at least one of:

    - `<label>` + `<input>`
    - `aria-label`
    - `aria-labelledby`

- `no-noninteractive-element-interactions`

  - Warns when `onClick` etc. used on non-interactive elements like `<div>`, `<span>`.
  - Must add `role`/`tabIndex` to indicate interactive element, or replace with `<button>`, `<a>`.

- `no-noninteractive-element-to-interactive-role`

  - Cannot assign interactive roles like `role="button"` to semantic containers like `<main>`, `<ul>`, `<li>`, `<img>`.
  - Use `<button>`, `<a>` for actual interactions.

- `no-noninteractive-tabindex`

  - Don't add `tabIndex` to non-interactive elements.
  - If focus/interaction is truly needed, upgrade to interactive element with `role`.

- `tabindex-no-positive`

  - `tabIndex > 0` is forbidden.
  - Only use `0` or `-1`.

### 4-3. Integration with Design Systems / Polymorphic Components

#### Component Mapping

```ts
export default [
  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      "jsx-a11y/control-has-associated-label": "error",
    },
    settings: {
      "jsx-a11y": {
        components: {
          MyButton: "button",
          MyTxt: "span",
        },
      },
    },
  },
];
```

- This applies the same a11y rules of `<button>`/`<span>` to `<MyButton>`/`<MyTxt>`.

#### Polymorphic as prop

```ts
export default [
  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      "jsx-a11y/control-has-associated-label": "error",
    },
    settings: {
      "jsx-a11y": {
        polymorphicPropName: "as",
        components: {
          MyButton: "button",
          MyTxt: "span",
        },
      },
    },
  },
];
```

- Configures a11y rules to work correctly on components rendered as various tags like `<MyButton as="a" href="/home">`.

#### Custom Label Prop Support

```ts
export default [
  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      "jsx-a11y/control-has-associated-label": [
        "error",
        {
          labelAttributes: ["contents"], // Example: <MyCard contents="Card content" />
        },
      ],
    },
    settings: {
      "jsx-a11y": {
        polymorphicPropName: "as",
        components: {
          MyButton: "button",
          MyTxt: "span",
          MyCard: "button",
        },
      },
    },
  },
];
```

---

## 5. Checklist for Writing New Components

Agents/developers must verify the following when creating new components:

1. **Role**: Are semantic tags used? Is `role` explicitly set when needed?
2. **Label**: Do all interactive elements have a name?
3. **State**: Are state attributes synchronized with HTML/ARIA?
4. **Keyboard Navigation**: Is the UI operable with Tab, Enter, Space, and arrow keys?
5. **Visual Dependency**: Is information not conveyed by color/icons alone?
6. **eslint-plugin-jsx-a11y**: Are configured rules not violated?
