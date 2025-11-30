# Recipe

## 프로젝트 목표

- 재료, 메뉴 등을 기반으로 다양한 레시피를 검색
- 인분, 무게를 변경하면 재료 양을 변경

> 임시 도메인 [Link](https://recipe-k.vercel.app)

## 개발 방향성

- Next.js v15 기반 프론트엔드 구현
- 별도의 서버 설정 없이 Prisma, Vercel Storage(supabase)를 이용하여 DB 구성

## tech stack

- Next.js v15
- Auth - Stateless Sessions ([middleware](https://github.com/jinhwansuh/recipe/blob/develop/middleware.ts), [Session](https://github.com/jinhwansuh/recipe/blob/develop/lib/session.ts))
- shadcn/ui, tailwind
- React-hook-form, Zod
- prisma, neon
