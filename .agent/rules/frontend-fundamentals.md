---
trigger: model_decision
description: Apply when writing or refactoring React/TypeScript code to ensure code quality (Readability, Predictability, Cohesion, Coupling)
---

# AGENTS – Frontend Code Quality

In this project, "good frontend code" means **code that is easy to change**.
Changeability is evaluated by four criteria: **Readability, Predictability, Cohesion, and Coupling**.

The following criteria are common rules that both humans and AI must follow when writing and refactoring code.

---

## 1. Readability

Goal: To reduce the **number of contexts that a code reader must hold in their mind at once**.

Agents/developers should prioritize the following when modifying/generating code.

### 1-1. Separate Code That Doesn't Execute Together

- If **branching logic for different cases (permissions, states, modes, etc.)** is mixed within a single component/function:
  - Split into **role-based components/functions** like "viewer / admin", "logged-in / logged-out".
  - Place common logic at a higher level and branch with `isViewer ? <Viewer /> : <Admin />`.
- For **cross-cutting conditional code** like `if (condition) return ...;` / `else ...`:
  - Break it down into "small components/functions responsible for only one role/state".

### 1-2. Abstract Implementation Details

- In higher-level components/pages, **show only what it does**:
  - Hide logic like "check login state and redirect" or "permission check"
    - Using Wrapper components (`AuthGuard`) or HOCs (`withAuthGuard`).
- To avoid understanding more than 6-7 elements at once:
  - **Abstract long logic into meaningful functions/components**.

### 1-3. Split Functions Mixed with Different Logic Types

- **Don't cram query parameters, state, API calls, formatting, etc., all into one Hook/function.**
- Avoid Hooks like `usePageState` that handle "all page state/queries", and instead:
  - Split into **single-responsibility Hooks** like `useCardIdQueryParam`, `useDateRangeQueryParam`.

### 1-4. Reveal Intent Through Naming

- For complex conditional expressions, **don't use nested ternaries/logical expressions as-is**:
  - Use **intermediate variables/functions with names** like `const isSameCategory = ...`, `const isPriceInRange = ...` to **expose meaning**.
- **No magic numbers** for numeric literals (300, 86400, 404, etc.):
  - Abstract them into constants like `ANIMATION_DELAY_MS`, `ONE_DAY_SECONDS`, `HTTP_NOT_FOUND`.

### 1-5. Make Code Read Top-to-Bottom, Minimize Context Switching

- Conditions for when a button is disabled, which UI to show for which permission, etc., should:
  - Be written so they **read sequentially from top to bottom** within a single function/component.
- Rather than creating overly abstract policy objects (`POLICY_SET`):
  - If the situation is simple, prefer **laying out requirements directly in code** with `switch (role)`.

---

## 2. Predictability

Goal: To make behavior **predictable from just the name, parameters, and return value** of a function/component.

### 2-1. Avoid Name Collisions

- **Don't create wrapper functions/modules with the same name as existing libraries.**
  - Example: A module wrapping `http` library should use a **different name** like `httpService`.
  - If it "attaches a token and sends an auth request", use names that reveal intent like `getWithAuth`, `fetchWithAuth`.

### 2-2. Unify Return Types for Similar Functions

- React Query Hooks that call server APIs should **always return `UseQueryResult`**.
  - Don't have `useUser`, `useServerTime`, etc., where some return `query` and others return `query.data`.
- Validation functions should use **consistent return type patterns**.
  - Example: `type ValidationResult = { ok: true } | { ok: false; reason: string }`
  - Ensure `checkIsNameValid`, `checkIsAgeValid` all return this type.

### 2-3. Expose Hidden Logic (Side Effects)

- Don't hide **hidden logging, tracking, or notification sending** inside functions that aren't revealed by the name/signature.
  - Don't silently call `logging.log` inside `fetchBalance()`.
- Place side effects **on the caller's side**:
  - Write logic **visibly at the call site** like `const balance = await fetchBalance(); logging.log("balance_fetched");`.

---

## 3. Cohesion

Goal: To **keep code that changes together in the same place**, reducing modification mistakes.

### 3-1. Place Files That Change Together in the Same Directory

- Instead of "putting all hooks/components/utils in one folder":
  - Use a **domain-based folder structure** as the default.

Example:

```text
src/
  components/         # Global common
  hooks/
  utils/
  domains/
    User/
      components/
      hooks/
      utils/
    Payment/
      components/
      hooks/
      utils/
```

- If you're deeply importing code from another domain like `../../../Domain2/...`:
  → Suspect a wrong dependency direction.
- When deleting a feature, design so you can **delete the entire directory at once**.

### 3-2. Elevate Magic Numbers to Cohesive Constants

- If numbers for animation, timers, polling, etc., **are likely to change together with other code**:
  - Elevate them to constants near the related logic so they're modified together.

```ts
const LIKE_ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
  await postLike(url);
  await delay(LIKE_ANIMATION_DELAY_MS);
  await refetchPostLike();
}
```

### 3-3. Design Form Cohesion

- When designing form validation, think about **"the unit of change"** first.

**When to choose field-level cohesion**

- When each field has **independent validation/async logic** and is reusable:
  - Example: Email format check, phone number format, ID duplication check, etc.
- If field reuse is important:
  - Separate into field component + field-specific validation util.

**When to choose form-wide cohesion**

- When the form **represents a single business action** and fields are strongly coupled:
  - Example: Payment info, shipping info, multi-step signup, password confirmation, total calculation, etc.
- In this case, define a **form-wide schema** using Zod/Schema:
  - Manage validation in one place.

---

## 4. Coupling

Goal: To keep the **scope of impact from a single change predictably narrow**.

### 4-1. Manage One Responsibility at a Time

- Avoid patterns like "one Hook handles all query parameters/state needed by this page":
  - Example: Don't create giant Hooks like `usePageState`.
- Instead, split into **small Hooks with separate responsibilities**:
  - `useCardIdQueryParam`
  - `useDateRangeQueryParam`
  - `useStatusListQueryParam`
- This way, modifying a specific Hook **limits the scope of impact**, reducing coupling.

### 4-2. Allow Code Duplication

- Don't do **premature abstraction/commonization** just because of "duplication".
- Extract into common Hook/component only when:
  - The same logic is currently used in multiple places, and
  - It's **likely to remain the same in the future**, and
  - Requirements from call sites don't diverge significantly.
- If behavior/logging/text is likely to differ slightly per page:
  - **Allow reasonable duplication** instead of extracting into a common Hook.
  - Narrowing the scope of impact when changes occur takes priority.

### 4-3. Reduce Props Drilling

- When a structure emerges where **the same props are continuously passed** from parent → child → grandchild…:
  - First, question whether "intermediate components are truly meaningful abstractions".
- Order:

  1. **Remove unnecessary intermediate abstractions**

     - Refactor ambiguous intermediate components like `ItemEditBody`
       into **components with clear roles** like `ItemEditSearch`, `ItemEditList`.

  2. **Use Composition pattern**

     - Pass lists/content directly via `children` from the parent,
       and have intermediate components only handle layout/common UI.

  3. If depth is still severe and multiple levels need the same data:

     - Only then introduce **Context API** as a last resort.

- Global state libraries (e.g., Redux, jotai):
  - Use only when **page-level state sharing** is needed,
  - Don't overuse just to avoid Props Drilling.

---

## 5. Trade-offs Among the Four Criteria

- The four criteria (Readability / Predictability / Cohesion / Coupling) **cannot always be maximized simultaneously**.
- Decision-making order usually prioritizes:

  1. **Readability** – If no one can read it, other criteria don't matter.
  2. **Predictability** – Confusion leads to bugs and maintenance costs.
  3. **Cohesion/Coupling** – Balance considering unit of change and scope of impact.

- When agents refactor:
  - Explicitly think about **which criteria to prioritize for this change** and modify accordingly.
