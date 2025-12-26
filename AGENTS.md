# AI Agents Guide

This project uses AI agent guidelines organized in the `agents/` directory.

## Commit Message Guidelines

- 커밋 메시지는 **한글**로 작성합니다
- 형식: `type: 설명`
- 예시:
  - `feat: [기능명] 구현`
  - `fix: [버그 설명] 수정`
  - `refactor: [대상] 리팩토링`
  - `chore: [작업 내용]`

## Agent Rules by Context

When working on different parts of the codebase, refer to the appropriate agent guidelines:

### Frontend Development

- **File**: `agents/toss-frontend-fundamentals/AGENTS.md`
- **When**: Writing or refactoring React/TypeScript code
- **Covers**: Code quality (Readability, Predictability, Cohesion, Coupling)

### Accessibility

- **File**: `agents/toss-frontend-fundamentals/ACCESSIBILITY.md`
- **When**: Building UI components
- **Covers**: ARIA roles, labels, keyboard navigation, screen reader support

### E2E Testing

- **File**: `agents/playwright-e2e/AGENTS.md`
- **When**: Writing or fixing Playwright tests
- **Covers**: Functional POM, test isolation, locator strategy, healer patterns

### Security

- **File**: `agents/meta-agents-rule/AGENTS.md`
- **When**: Designing AI agent features or handling untrusted inputs
- **Covers**: Agents Rule of Two, prompt injection defense

## How to Use

1. **Before starting a task**, identify which domain(s) it belongs to
2. **Read the relevant AGENTS.md file(s)** from the `agents/` directory
3. **Follow the guidelines** while implementing your changes
4. **Reference specific sections** when making decisions

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Package Manager**: yarn
- **Database**: Neon (PostgreSQL)
- **Auth**: Clerk
- **Styling**: Tailwind CSS

## Quick Commands

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Run tests
yarn test

# Run E2E tests
yarn test:e2e

# Type check
yarn lint  # Runs tsc + eslint

# Lint fix
yarn lint:fix

# Format code
yarn prettier

# Database
yarn schema        # Run migrations
yarn schema:pull   # Pull schema from DB
yarn prisma        # Open Prisma Studio
```

## Progressive Disclosure

The `agents/` folder contains detailed guidelines. **Don't read everything at once**.

Instead:

1. Identify your current task
2. Read only the relevant agent guideline(s)
3. Focus on the specific sections that apply

This keeps your context focused and improves decision quality.
