# best4U — Angular Frontend

Angular workspace scaffold for best4U, replacing the React app under
`best4U-FrontEnd/`. This is the **structure**, built to hold everything in
the platform roadmap (Shopping, Tools, Finance, Productivity, Documents,
Developer, AI, ...) without needing to be reorganized every time a new
module is added.

## Status: Phase 1 — Foundation (in progress)

What's actually working right now: `npm install`, `ng serve`, and you get a
page rendered by the `home` feature. That's it — everything else is folder
structure with a `README.md` explaining what belongs there and why it isn't
built yet. Nothing here should be mistaken for a finished feature.

## Getting started (run locally — this was scaffolded without network access)

```bash
npm install
ng serve
```

Then open http://localhost:4200.

**Before running:** check `ng version` after `npm install` — Angular 22 was
current stable at the time this was scaffolded, but versions move fast;
if a newer stable has shipped, it's worth confirming these files still
match its `ng new` defaults (angular.json schema, zoneless bootstrapping)
before building on top of them.

## Folder structure

```text
src/app/
├── core/          — app-wide singletons: auth, guards, interceptors, services, models
├── shared/        — reusable, feature-agnostic UI: components, directives, pipes, utilities
├── layout/        — app shell: header, footer, sidebar
├── platform/      — cross-cutting platform features: search, favorites, recently-used, dashboard
└── features/      — one folder per module, lazy-loaded, self-contained
    ├── home/      — the only feature with real code right now
    └── auth/      — login/register — scaffolded, blocked on backend fixes
```

Each empty folder has a `README.md` explaining what goes there, what it
replaces from the React app (if anything), and what it's blocked on. See
those files rather than guessing from the folder name.

## Deliberate choices made here (and why)

- **Standalone components, no NgModules** — current Angular default, and
  there's no reason for this app to carry NgModule boilerplate.
- **Signals + local state services, not NgRx** — the app is small; NgRx's
  overhead isn't earning itself yet. Reconsider only if cross-module state
  genuinely tangles later (see the vision doc's "avoid overengineering"
  section).
- **Zoneless change detection** — current Angular default direction; no
  `zone.js` dependency.
- **Local storage vs backend, decided per module up front**: Tools,
  Finance, Productivity, Documents, Developer → local storage, no backend
  calls at all. Auth, Shopping (cart/orders), Dashboard sync → backend.
  This is a cost decision (Section 8/9 of the vision doc), not an
  afterthought.
- **Design tokens left empty on purpose** (`src/assets/styles/_colors.scss`
  etc.) — filling them with placeholder colors now would just mean redoing
  them deliberately later. They get decided when we actually build the
  design system, not auto-generated here.

## What's explicitly NOT here yet, and why

- No `finance/`, `tools/`, `productivity/`, `documents/`, `developer/`,
  `ai/`, or `shopping/` feature folders yet. Per the vision doc's own rule
  ("do not attempt to build everything immediately"), these get added one
  at a time, each as its own phase — not scaffolded speculatively.
- No real `core/auth` or `features/auth` implementation yet. Building
  login/register against the *current* backend would mean building it
  against plaintext passwords and a `User` entity with no `roles` field —
  both are being fixed on the backend side (Track A) first, and the exact
  request/response shape needs to be agreed (the API contract) before this
  is wired up for real.
- No design system (colors/type/spacing tokens, shared Button/Card/Modal
  components) yet — intentionally sequenced right after this, since layout/
  and shared/ both depend on it.

## Assets carried over from the React app

The favicon set in `public/` was copied from the existing React app's
`src/Assets/favicon_io/` rather than regenerated — an existing, working
asset with no reason to be redone.
