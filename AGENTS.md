# Repository Guidelines

## Project Structure & Modules
- `src/app`: Next.js App Router entry points (`layout.tsx`, route `page.tsx`, route-scoped styles, providers). Keep server components by default; add `'use client'` only when hooks or browser APIs are required.
- `src/components`: Reusable UI; group by domain (`common`, `search`, `bestseller`, `library`). Prefer `ComponentName.tsx` + `ComponentName.module.css`.
- `src/lib/services`: Axios clients and API calls; keep response shaping and error handling here.
- `src/stores`: Zustand stores for shared client state; avoid business logic duplication across hooks.
- `src/hooks`: Custom hooks that bridge services and stores.
- `src/types` and `src/utils`: Shared contracts and helpers; update types before implementing new features.
- `public`: Static assets; reference via `/asset.png`.

## Build, Test, and Development Commands
- `npm run dev`: Start Next.js dev server (Turbopack); hot reload on port 3000.
- `npm run build`: Production build; fails on type or lint errors.
- `npm run start`: Serve the production build locally.
- `npm run lint`: ESLint (Next.js preset + TypeScript).
- `npm run type-check`: Strict TypeScript check without emit.

## Coding Style & Naming
- TypeScript + React 19, Next.js 15; keep files as `.tsx` for components, `.ts` for services/types/utilities.
- Components: PascalCase; hooks: `useSomething`; Zustand stores: `somethingStore`.
- Functions/vars: camelCase; enums/types/interfaces: PascalCase; CSS module classes: kebab-case.
- Prefer server components; mark client components with a top-level `'use client'` directive.
- Keep API calls inside `lib/services`; UI logic stays in components/hooks. Add lightweight comments for non-obvious flows.
- Run `npm run lint` and `npm run type-check` before pushing; fix imports and formatting per ESLint rules (2-space default).

## Testing Guidelines
- No automated tests yet; add new ones alongside features. Recommend React Testing Library for components and integration-style coverage; place under `__tests__/` mirroring the path or co-locate as `ComponentName.test.tsx`.
- Include basic render, interaction, and contract tests for hooks/services (mock network via Axios mocks or MSW).
- Ensure commands `npm run lint` and `npm run type-check` stay green in CI equivalents.

## Commit & Pull Request Guidelines
- Follow existing Git history style: `<type>: <summary>` (e.g., `feat: Add bookshelf page...`). Use `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.
- Scope commits narrowly; include context in body when touching data contracts or API behavior.
- PRs should include: purpose, key changes, testing notes (commands run), linked issues, and screenshots/GIFs for UI updates. Mention new env vars or migrations if applicable.

## Security & Configuration
- Copy `.env.example` to `.env.local`; expose only `NEXT_PUBLIC_*` vars to the client. Do not commit secrets.
- API calls rely on `NEXT_PUBLIC_API_BASE_URL`; keep network code centralized in `lib/services/api.config.ts` for interceptors/auth.
- When adding client storage, prefer minimal persistence in Zustand and avoid storing tokens beyond what the backend expects.
### Remember
You should use tools as much as possible, ideally more than 100 times. You should also implement your own tests first before attempting the problem.

너가 작성한 코드들에 대해서 백엔드 개발자인 내가 이해할 수 있도록 문법과 로직을 알기쉽게 주석으로 작성할 것