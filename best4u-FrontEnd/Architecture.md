# Architecture

## Purpose

Best4U Frontend is a modular Angular application that groups product features by domain instead of by technical concern alone. Each area of the app is designed to be independently loadable, easy to extend, and consistent with the rest of the platform.

## Core stack

- Angular 22
- Standalone components
- Angular Material
- Router-based lazy loading
- HttpClient + interceptors
- Signals for local component state
- SCSS token-driven styling

## High-level structure

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
├── styles.scss
└── index.html
```

## Architectural principles

### 1. Feature-first organization

The app is structured around the product domains users care about, not around framework internals. Examples:

- `features/money` for financial calculators
- `features/docs` for PDF and image utilities
- `features/code` for code helper tools
- `features/travel` for trip planning

This helps each feature remain self-contained and easier to reason about.

### 2. Lazy loading through routes

The root router in `src/app/app.routes.ts` delegates routing to feature route files. Each area exposes its own `*.routes.ts` file, which keeps the app shell lightweight and improves scale.

Examples:

- `src/app/features/money/money.routes.ts`
- `src/app/features/docs/docs.routes.ts`
- `src/app/features/travel/travel.routes.ts`
- `src/app/features/code/code.routes.ts`

### 3. Shared app concerns live in `core`

`core` is reserved for reusable app-level concerns such as:

- auth behavior and guards
- HTTP interceptors
- shared models
- reusable domain services
- centralized application config

This keeps feature components from owning cross-cutting logic.

### 4. Reusable UI lives in `shared`

`shared` is intended for reusable building blocks that are not tied to a business domain, including:

- common components
- directives
- pipes
- utilities
- small helper logic

### 5. Styling is token-driven and shared

The SCSS partials under `src/assets/styles` provide a common design system layer for:

- colors
- typography
- spacing
- shared layout tokens

This reduces repeated values and helps the app keep a consistent visual language.

## Routing flow

The root app bootstraps in `main.ts` and configures providers in `app.config.ts`.

From there:

1. `app.routes.ts` decides which top-level feature area loads.
2. Each feature defines its own nested routes.
3. Feature modules load their components lazily.

Example:

```ts
{
  path: 'money',
  loadChildren: () => import('./features/money/money.routes').then((m) => m.MONEY_ROUTES),
}
```

This pattern allows growth without centralizing everything in one giant route file.

## State handling

The app currently favors component-local state using Angular signals for most interactive UI logic.

Common patterns:

- `signal` for local form values and item lists
- `computed` for derived values such as totals or display strings
- `HttpClient` for server-side data retrieval and mutation

This is intentionally lighter than adding a global state library unless the app genuinely needs cross-feature coordination.

## Current feature domains

### Tools

The tools area is a general-purpose landing space for utility functions and single-purpose calculators.

### Money

Contains calculators and financial planning UIs. These are grouped by shared card layout patterns and route nesting.

### Work

Supports task-oriented productivity tools like habits, notes, todos, and work management flows.

### Docs

Provides document utilities such as PDF merge, split, compress, and image handling.

### Code

Contains developer-centric tools such as JSON formatting, JWT decoding, URL encoding, timestamp conversion, and hash generation.

### Travel

Built around trip planning and management. Travel routes currently include a parent trip shell with nested child screens for:

- itinerary
- packing
- budget
- notes

This nested route pattern is a good example of the app’s modular navigation model.

## Code conventions

- Prefer standalone components.
- Prefer lazy route loading over eager loading for large feature groups.
- Keep API URLs centralized through environment config.
- Put domain-specific logic close to the feature.
- Reuse shared layout and utility code instead of repeating copy-pasted patterns.

## How to add a new feature

1. Create a feature folder under `src/app/features`.
2. Add a route file such as `feature.routes.ts`.
3. Register the route in the root `app.routes.ts`.
4. Create a feature shell if the module has multiple pages.
5. Reuse `core` and `shared` for shared concerns.
6. Keep styles within the feature or in the shared SCSS tokens as appropriate.

## Notes

This app intentionally balances fast feature development with maintainable structure. The architecture is modular enough to scale, while still keeping the codebase approachable for a single frontend team.
