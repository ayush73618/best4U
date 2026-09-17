# Best4U — Technical Documentation

This document explains how the Best4U codebase actually works: every backend package, every frontend module, and the request flows that connect them. It assumes you can read Java/TypeScript but haven't traced this specific codebase end-to-end yet.

---

## 1. Architecture Overview

```
Angular (single app, feature modules)  --HTTP/JSON-->  Spring Boot (single app, domain packages)  -->  Postgres
     localhost:4200                                          localhost:8080/api
```

- **One frontend app, one backend app, one database.** This is a deliberate **modular monolith**, not microservices — see the "Why no Eureka/Gateway" note in section 2.1.
- **Every domain (auth, product, work-todos, work-notes, work-habits, and eventually money/docs/code) follows the same four-file pattern on the backend:** `Entity → Repository → Service → Controller`. Once you understand one (Todo is the simplest), you understand all of them.
- **Every backend response uses the same envelope shape:** `{ success: boolean, message: string, data: T }`. The frontend's `ApiResponse<T>` model mirrors this exactly.
- **Authentication is stateless JWT.** No server-side session. The token itself is the proof of who's logged in, checked fresh on every request.

---

## 2. Backend (`best4u-backend`)

### 2.1 Project structure & why it's shaped this way

```
com.best4u.backend/
├── Best4uBackendApplication.java   ← the one entry point; running this starts the whole server
├── common/                         ← shared by every module below, not feature-specific
├── security/                       ← JWT creation/validation, used by every protected endpoint
├── user/                           ← accounts: register, login
├── product/                        ← product catalog
└── work/
    ├── todo/
    ├── note/
    └── habit/
```

**Why no Eureka or API Gateway:** those tools exist so multiple independent backend *services* can find and route to each other. There is only one backend service here — everything above runs inside a single JVM process, started by a single `main()` method. Adding service discovery for a single service adds operational cost (more processes to run, more config) for zero benefit. If a specific domain (say, `product`) ever needs to scale independently of everything else, *that's* the point where it gets pulled into its own Spring Boot app and Eureka/Gateway become worth reintroducing.

### 2.2 `common/` — shared plumbing

| File | What it does | How |
|---|---|---|
| `Best4UResponse.java` | The universal response envelope | A generic class with `success`, `message`, `data`. Every controller method returns one, via static helpers `Best4UResponse.ok(data)` or `Best4UResponse.error(message)` — so no controller manually constructs the shape by hand. |
| `ApiException.java` | A "this failed for a known reason" signal | Extends `RuntimeException`, carries an `HttpStatus`. Services throw this (e.g. `throw new ApiException(HttpStatus.CONFLICT, "Email already exists.")`) instead of returning null or a boolean — the caller doesn't need to check a return value, the exception *is* the error path. |
| `GlobalExceptionHandler.java` | Catches exceptions app-wide | Annotated `@RestControllerAdvice`, which makes Spring route **every** uncaught exception from **every** controller through it. Two handlers: one for `ApiException` (uses its embedded status code and message), one catch-all for anything unexpected (returns `500` with a generic message). This is why no individual controller has a `try/catch` — it's centralized here once. |

### 2.3 `security/` — authentication machinery

This is the package every other module depends on, but doesn't depend on anything else in the app.

| File | Role | Mechanics |
|---|---|---|
| `JwtService.java` | Creates and reads tokens | `generateToken(userId)` builds a JWT with the user's ID as the `subject` claim, signed with a secret key (from `application.properties`), expiring after `best4u.jwt.expiration-ms`. `extractUserId(token)` reverses this. `isValid(token)` tries to parse it and catches any exception (expired, tampered, malformed) as "invalid." |
| `JwtAuthFilter.java` | Runs on **every** incoming HTTP request | A `OncePerRequestFilter`. Reads the `Authorization: Bearer <token>` header. If present and valid, it manually sets Spring Security's `SecurityContextHolder` with the extracted `userId` as the "principal" — this is what makes the request "authenticated" for the rest of the pipeline. If no token or an invalid one, it just calls `chain.doFilter()` and lets the request continue *unauthenticated* (not blocked here — blocking happens next, in `SecurityConfig`). |
| `SecurityConfig.java` | The rulebook: which routes need auth | Declares `/auth/**` and `GET /products/**` as public (`permitAll()`), and `anyRequest().authenticated()` for everything else. Registers `JwtAuthFilter` to run *before* Spring's own login filter. Also configures CORS (only `http://localhost:4200` is allowed to call this API) and disables CSRF (irrelevant for a stateless JWT API — CSRF protection matters for cookie-based sessions, not bearer tokens) and disables server-side sessions entirely (`STATELESS`). |
| `AuthUtil.java` | "Who is making this request?" | A static helper: `AuthUtil.currentUserId()` reads whatever `JwtAuthFilter` put on the security context. Throws `ApiException(401)` if nobody's logged in. Every `work/*` service calls this instead of trusting a `userId` field the client could fake in a request body. |

**The full request-authentication sequence:**
```
Request arrives → JwtAuthFilter reads header, validates token, sets SecurityContext
                → SecurityConfig checks: is this route public, or does it need auth?
                → if it needs auth and SecurityContext is empty → 401, request stops here
                → if authenticated (or route is public) → reaches the controller
                → controller/service calls AuthUtil.currentUserId() to know whose data to touch
```

### 2.4 `user/` — accounts

| File | Role |
|---|---|
| `User.java` | The `app_user` table. Fields: `id`, `firstName`, `lastName`, `email` (unique), `passwordHash` (never the raw password), `mobileNumber` (optional), `roles` (a `List<String>` stored in a separate `user_roles` table via `@ElementCollection`, defaulting to `["USER"]` — present on the model, not yet enforced anywhere). |
| `UserRepository.java` | A Spring Data JPA interface — `findByEmail`, `existsByEmail`. No implementation code needed; Spring generates the SQL from the method name at startup. |
| `dto/RegisterRequest.java`, `LoginRequest.java`, `AuthResponse.java` | The shapes of what comes in and goes out over HTTP — separate from the `User` entity on purpose, so the entity (a DB concern) can change independently of the API contract, and so `passwordHash` is never accidentally serialized back to the client. |
| `UserService.java` / `UserServiceImpl.java` | The actual logic. `register()`: checks the email isn't taken, hashes the password with BCrypt (`passwordEncoder.encode()` — never stores plaintext), saves the user, returns a signed JWT plus the user's public fields. `login()`: looks up by email, compares the submitted password against the stored hash with `passwordEncoder.matches()` (BCrypt hashing is one-way — you can't "decrypt" the stored hash, you re-hash the input and compare), returns a fresh token. Both return the *same* `AuthResponse` shape via a shared private `toAuthResponse()` helper. |
| `AuthController.java` | Exposes `POST /auth/register` and `POST /auth/login`. Both are thin — `@Valid` triggers the Jakarta Bean Validation annotations on the DTOs (`@NotBlank`, `@Email`, `@Size(min=8)`) automatically, rejecting malformed requests with a `400` before the controller method body even runs. The method body is just one line calling the service and wrapping the result in `Best4UResponse.ok(...)`. |

### 2.5 `product/` — catalog

Same shape as `user/`, simpler: `Product` entity (`name`, `description`, `price`) → `ProductRepository` (plain JPA, no custom queries yet) → `ProductServiceImpl` (`listAll()`, `create()`) → `ProductController` (`GET /products` public, `POST /products` requires login — currently *any* logged-in user, not restricted to a seller/admin role; flagged as a TODO in the controller's own comment).

### 2.6 `work/` — todos, notes, habits

Three parallel feature folders, each identical in shape. Walking through `todo/` explains all three:

- **`Todo.java`** — the table: `id`, `userId` (whose todo this is), `text`, `done`, `createdAt`.
- **`TodoRepository.java`** — `findByUserIdOrderByCreatedAtDesc(userId)`. Note it's scoped by `userId` in the query itself, not filtered after fetching everything.
- **`TodoService.java`** — every method calls `AuthUtil.currentUserId()` to know whose data to touch. The private `owned(id)` helper is the security-critical part: it fetches the todo by ID, then explicitly checks `todo.getUserId().equals(currentUserId())` — throwing `403 Forbidden` if not. **This is what stops User A from reading/editing/deleting User B's todo by guessing an ID in the URL.** `toggle()` and `delete()` both go through `owned()` first.
- **`TodoController.java`** — thin REST layer: `GET /work/todos` (list mine), `POST /work/todos` (create), `PUT /work/todos/{id}/toggle`, `DELETE /work/todos/{id}`.

`note/` and `habit/` repeat this exact pattern — `Note` adds a `title`/`body`/`updatedAt`; `Habit` adds a `completedDates` list (stored via `@ElementCollection` in its own `habit_completed_dates` table) and a `currentStreak()`-style calculation that lives in the **frontend**, not the backend (the backend just stores/returns the raw date list; streak math is presentation logic).

### 2.7 Database tables (auto-created by `ddl-auto=update` from the entities above)

`app_user`, `user_roles`, `product`, `todo`, `note`, `habit`, `habit_completed_dates` — one table per entity, plus the two `@ElementCollection` side-tables for `roles` and `completedDates`.

---

## 3. Frontend (Angular)

### 3.1 Structure

```
src/app/
├── core/           ← app-wide singletons: auth, http interceptors, route guards, shared models
├── layout/          ← header, sidebar, category-bar — the chrome around every page
├── shared/          ← reusable utilities/components with no single feature owner (currency formatting, currency-switcher)
├── assets/styles/    ← shared SCSS partials (_calculator.scss, _work.scss, design tokens)
└── features/
    ├── auth/         ← login, register
    ├── money/        ← BM4U: EMI, SIP, PPF, SWP, RD, FD calculators
    ├── work/          ← BW4U: todos, notes, habits
    └── tools/         ← BT4U: standalone calculator (built earliest, separate pattern)
```

### 3.2 `core/` — the app-wide backbone

- **`auth/auth.service.ts`** — the single source of truth for "who's logged in." Holds `currentUser` as a **signal** (not a `BehaviorSubject` — matches the signals-first convention used everywhere else in this app). `register()`/`login()` POST to the backend, and on success, `storeSession()` splits the response into the JWT (→ `localStorage` under `best4u:token`) and the user object (→ `localStorage` under `best4u:user`, and into the `currentUser` signal). On app reload, the constructor's `loadStoredUser()` reads `localStorage` back into the signal, so a refresh doesn't log you out. `logout()` clears both storage keys, resets the signal, and redirects to `/`.
- **`interceptors/auth.interceptor.ts`** — a functional `HttpInterceptorFn`. Runs on **every** outgoing HTTP request. Reads the stored token via `AuthService.getToken()`, and if present, clones the request with an added `Authorization: Bearer <token>` header. This is *why* none of the feature components (Todos, Notes, etc.) ever mention the token — it's attached invisibly here, once, for the whole app.
- **`interceptors/error.interceptor.ts`** — also runs on every request, but on the *response* side. Catches HTTP errors: if the status is `401` (token expired/invalid), it force-logs-out and redirects to login. For any other error, it unwraps the backend's `message` field (from the `Best4UResponse` envelope) into a plain `Error`, so components can just do `.subscribe({ error: (err) => showMessage(err.message) })` without parsing the raw HTTP error shape themselves.
- **`guards/auth.guard.ts`** — a `CanActivateFn`. Checked by the router before entering a route (currently applied to `/work`). If `authService.isAuthenticated()` is false, redirects to `/auth/login` and blocks the navigation.
- **`models/api-response.model.ts`, `user.model.ts`** — TypeScript interfaces mirroring the backend's `Best4UResponse<T>` and `AuthResponse` shapes exactly, so a mismatch between what the backend actually sends and what the frontend expects shows up as a compile-time type error instead of a silent runtime bug.

### 3.3 `features/auth/` — login & register

- **`login.ts`/`register.ts`** — signal-based form state (each field is its own signal, same pattern as every calculator in `money/`), a client-side validation check before submitting, and a `submit()` that calls `AuthService.login()`/`.register()`, navigating to `/work` on success or showing `err.message` (already unwrapped by `error.interceptor.ts`) on failure.
- Both share `auth.scss` styling and are registered as lazy-loaded routes in `auth.routes.ts`, mounted at `/auth` in the app-level router.

### 3.4 `features/money/` — the six calculators

- **`core/services/financial-calc-engine.ts`** — the shared math. Pure functions (`futureValueSIP`, `futureValuePPF`, `swpProjection`, etc.) — no Angular, no UI, just numbers in/numbers out. Every calculator component imports from here rather than reimplementing its own compound-interest formula, so a floating-point bug fix or formula correction happens in one place and every calculator benefits.
- **`shared/utilities/currency.ts`** + **`core/services/currency-config.service.ts`** — `CurrencyConfigService` holds the selected currency as a signal, persisted to `localStorage`, defaulting to INR. `formatCurrency(value, currencyOption)` is a pure formatting function each calculator calls. `formatINRFixed()` is a separate function used only for PPF's legally-fixed ₹ limits, which must **never** change display currency regardless of what the user has selected — a regulatory number isn't a display preference.
- **Each calculator (`emi-calculator`, `sip-calculator`, etc.)** — identical shape: signals for each input field, a `computed()` validation message (checked in the order a user fills the form, not all at once), a `computed()` result calling the shared engine, and `computed()` formatted-currency strings for display. All share one `_calculator.scss` partial (`.calc`/`.calc-page` BEM classes) instead of each having its own stylesheet.
- **`money-shell/`** — the parent route: a tab bar (EMI/SIP/PPF/SWP/RD/FD) plus a `<router-outlet>`, with EMI as the default via a redirect route.

### 3.5 `features/work/` — todos, notes, habits

- **`work-shell/`** — same shell pattern as Money: tab bar (To-dos/Notes/Habits) + `<router-outlet>`, guarded by `authGuard` (you must be logged in to reach any of this).
- **`todos.ts`/`notes.ts`/`habits.ts`** — each injects `HttpClient` directly (no separate "TodoService" layer was introduced — the component *is* the thin API-calling layer, matching the current codebase's scale) and calls the matching backend URL (`/api/work/todos`, `/api/work/notes`, `/api/work/habits`) on `ngOnInit()`. State lives in a `signal<T[]>`, updated optimistically after each successful HTTP call (e.g. `toggleTodo` doesn't refetch the whole list — it patches the one changed item into the existing signal array) rather than reloading everything after every action.
- All three share `_work.scss` (`.work`/`.work-page` classes) — deliberately **not** the same partial as Money's `_calculator.scss`, since Work isn't a calculator.

### 3.6 `layout/header/`

Shows the Best4U logo, a disabled search box (placeholder — search doesn't exist yet), and conditionally either a "Sign in" link or the logged-in user's name + a logout button, based on `AuthService.isAuthenticated()`.

---

## 4. End-to-end flows

### 4.1 Registering, then making an authenticated request

```
1. User submits the register form
2. Register component → AuthService.register(payload)
3. AuthService → HTTP POST /api/auth/register (auth.interceptor adds no header here — no token exists yet)
4. Backend: AuthController → UserServiceImpl.register()
   → checks email uniqueness → hashes password (BCrypt) → saves User row
   → JwtService.generateToken(newUserId) → returns AuthResponse
5. AuthService.storeSession() splits the response: token → localStorage, user → localStorage + currentUser signal
6. Router navigates to /work
7. authGuard checks isAuthenticated() → true → route loads
8. Todos component ngOnInit() → HTTP GET /api/work/todos
9. auth.interceptor attaches "Authorization: Bearer <token>" automatically
10. Backend: JwtAuthFilter validates token → sets userId on SecurityContext
11. TodoController → TodoService.listMine() → AuthUtil.currentUserId() → repository query scoped to that user
12. Empty list returned (new user, no todos yet) → rendered as "Nothing here yet"
```

### 4.2 What happens on a stale/expired token

```
Request goes out with an old token → JwtAuthFilter.isValid() returns false → SecurityContext stays empty
→ SecurityConfig sees the route requires auth, context is empty → responds 401
→ error.interceptor catches the 401 → calls authService.logout() → redirects to /auth/login
```

---

## 5. Known gaps (accurate as of this doc — check before assuming still true)

- No refresh tokens — a JWT simply expires after 24h and the user must log in again.
- No password-reset flow.
- `roles` exists on the `User` model but nothing checks it yet — any logged-in user can currently `POST /products`.
- `localStorage`-based token storage is vulnerable to XSS reading the token (a common trade-off vs. httpOnly cookies, acceptable for this stage but worth revisiting before a public launch).
- Habit "streak" is computed client-side from raw dates on every render — fine at current scale, would move server-side if habits data grows large per user.

---

## 6. Local dev checklist

1. Postgres running, `best4u` database created.
2. Backend: run `Best4uBackendApplication` (not the test class) in STS — confirm console shows `Tomcat started on port 8080`.
3. Frontend: `ng serve` — confirm `environment.ts` has `apiBaseUrl: 'http://localhost:8080/api'`.
4. Register a test user through the UI, confirm you land on `/work` and can add a todo that survives a page refresh (proves the DB round-trip actually works, not just the UI state).
