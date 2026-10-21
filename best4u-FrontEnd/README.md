# Best4U Frontend

Angular 22 application for the Best4U product suite. The app is built with standalone components, lazy-loaded feature routes, and Angular Material for select/input-heavy tool UIs.

## Overview

This frontend powers a multi-area utility platform with modules for:

- Home / app landing
- Tools and calculators
- Money calculators and financial planning
- Work productivity features
- Auth flow
- Code utilities
- Document tools (PDF, image processing)
- Travel planning tools

The app uses a modular route structure under `src/app/features` so each product area can grow independently.

## Tech stack

- Angular 22
- Angular Material
- RxJS
- TypeScript
- Standalone components
- Signals for local component state
- Zone-less change detection
- HttpClient for API calls

## Getting started

```bash
npm install
npm start
```

Then open:

```text
http://localhost:4200
```

Production build:

```bash
npm run build
```

## Project structure

```text
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── models/
│   │   └── services/
│   ├── features/
│   │   ├── auth/
│   │   ├── calculator/
│   │   ├── code/
│   │   ├── docs/
│   │   ├── home/
│   │   ├── money/
│   │   ├── tools/
│   │   ├── travel/
│   │   └── work/
│   ├── layout/
│   ├── platform/
│   ├── shared/
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── app.ts
│   └── app.html
│
├── assets/
│   └── styles/
├── environments/
├── main.ts
└── styles.scss
```

## Routing model

The app uses a route-first structure. Top-level routes are registered in `src/app/app.routes.ts` and feature-specific child routes are defined in each feature module.

Current major routes include:

- `/` → home
- `/tools` → tool shell
- `/money` → calculators and financial tools
- `/work` → productivity workflows
- `/auth` → login/register
- `/docs` → PDF / image tools
- `/code` → developer utilities
- `/travel` → trip planner and travel utilities

Examples:

- `src/app/features/money/money.routes.ts`
- `src/app/features/docs/docs.routes.ts`
- `src/app/features/code/code.routes.ts`
- `src/app/features/travel/travel.routes.ts`

## Current implementation status

This project is not just stubbed scaffolding anymore. It already contains usable feature implementations across several domains, including:

- Money calculators (EMI, SIP, PPF, RD, FD, SWP)
- PDF tools (merge, split, compress)
- Image tools
- Travel planners (trip list, itinerary, packing, budget, notes)
- Code utilities (JSON formatter, JWT decoder, hash generator, URL encoder, UUID generator, etc.)

The app is organized to keep each product area self-contained while sharing common layout and utility logic.

## Architecture conventions

- Standalone components are the default pattern.
- Feature modules are lazy-loaded through route files.
- Shared logic belongs in `core` and `shared`.
- Domain utilities and API-facing services live in `core/services` and `core/models`.
- Styling is centralized into SCSS style partials under `src/assets/styles`.
- UI behavior is kept in component logic and signals, not in a global store.

## Development notes

- Prefer local state with signals for component-level data.
- Use `loadComponent` / `loadChildren` for lazy routes.
- Keep cross-cutting logic in `core/` and reusable UI in `shared/`.
- Avoid adding one-off state to unrelated features.
- Reuse shared design tokens from `src/assets/styles` rather than hardcoding repeated colors and spacing.

## Future direction

The frontend is designed to grow as a modular product suite. New areas should be added as route-based feature modules rather than by expanding the root app shell.
