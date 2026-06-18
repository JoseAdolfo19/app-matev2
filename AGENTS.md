# AGENTS.md

## Project overview
- This repository is a Vite + React + TypeScript app for a mock educational platform UI.
- The main flow starts in [src/App.tsx](src/App.tsx), where auth state and tab navigation are managed.
- Shared data contracts live in [src/types.ts](src/types.ts).
- Mock backend responses and simulated API helpers live in [src/mockData.ts](src/mockData.ts).
- Feature-specific UI logic lives under [src/components](src/components).

## Setup and verification commands
- Install dependencies: `npm install`
- Start the dev server: `npm run dev`
- Build for production: `npm run build`
- Run type checks: `npm run lint`
- The local setup instructions are in [README.md](README.md).

## Environment notes
- If you run the app locally, set the environment variable described in [README.md](README.md) before starting the server.
- The dev server is configured in [vite.config.ts](vite.config.ts); avoid changing it unless the task specifically requires it.
- The app is designed around mock data, so changes to UI behavior should usually be made without introducing a new backend dependency.

## Architecture notes
- Prefer updating existing components instead of creating new global state containers.
- Keep prop-based patterns consistent with the current React setup.
- If you change data models, update both [src/types.ts](src/types.ts) and [src/mockData.ts](src/mockData.ts) together when needed.
- For content that loads externally (videos, links, or embeds), prefer safe embeddable URLs and keep a fallback path for unsupported sources.

## Code conventions
- Use TypeScript React functional components.
- Keep visible text and labels in Spanish when working on existing screens.
- Follow the existing styling style (Tailwind classes and component layout patterns).
- Verify behavior with `npm run lint` after code changes; run `npm run build` when a change affects the production flow.

## Helpful areas to inspect first
- [src/App.tsx](src/App.tsx) for top-level routing and layout.
- [src/components](src/components) for feature-specific logic.
- [src/mockData.ts](src/mockData.ts) for seed data and fake API responses.
- [src/types.ts](src/types.ts) for shared interfaces and domain models.
