# AI Agents Guide

This project uses the Gemini Rules system in `.agent/rules/` directory.

## Rules (`.agent/rules/`)

| Rule | Trigger | Source |
|------|---------|--------|
| `commit-message-guide.md` | always_on | inline |
| `frontend-fundamentals.md` | model_decision | inline |
| `accessibility.md` | model_decision | @mention → `agents/` |
| `playwright-e2e.md` | model_decision | @mention → `agents/` |
| `agents-security.md` | model_decision | inline |

> 12KB 초과 파일은 `agents/` 폴더에 원본 유지, `@` 멘션으로 참조

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Package Manager**: yarn
- **Database**: Neon (PostgreSQL)
- **Auth**: Clerk
- **Styling**: Tailwind CSS

## Quick Commands

```bash
yarn install       # Install dependencies
yarn dev           # Run development server
yarn test          # Run tests
yarn test:e2e      # Run E2E tests
yarn lint          # Type check (tsc + eslint)
yarn lint:fix      # Lint fix
yarn prettier      # Format code
yarn schema        # Run migrations
yarn prisma        # Open Prisma Studio
```
