# Best4U Backend — HLD, LLD & File-by-File Guide

This document explains the *why* behind every layer, not just the *what*. It's written the way I'd walk a Java developer through this codebase in person — starting from the 10,000-foot view, then drilling into the pattern every module follows, then module by module.

---

## PART 1 — High-Level Design (HLD)

### 1.1 System overview

```
┌─────────────┐        HTTPS/JSON         ┌──────────────────┐        JDBC        ┌────────────┐
│   Angular    │ ────────────────────────▶ │   Spring Boot     │ ─────────────────▶ │  Postgres  │
│  (frontend)  │ ◀──────────────────────── │  (one deployable)  │ ◀───────────────── │            │
└─────────────┘                            └──────────────────┘                    └────────────┘
                                                     │
                                                     ▼
                                            ┌──────────────────┐
                                            │  Razorpay API     │  (external payment gateway)
                                            └──────────────────┘
```

- **One frontend app, one backend app, one database.** This is a **modular monolith**, not microservices. Every business domain (auth, product, cart, order, work, travel, docs) lives in its own Java package, but they all run inside a single JVM process, deployed as one artifact. See §1.3 for why.
- **Every backend HTTP response uses the same envelope**: `{ success: boolean, message: string, data: T }` — defined once in `common/Best4UResponse.java`, used by every controller in the app. A frontend developer never has to guess the response shape module to module.
- **Authentication is stateless JWT** — no server-side session storage. The token itself, once issued, is the only proof of identity the server needs on every subsequent request.

### 1.2 Request lifecycle, end to end

Every authenticated request follows this exact path, regardless of which module it's hitting:

```
1. Angular attaches "Authorization: Bearer <token>" automatically
   (core/interceptors/auth.interceptor.ts — invisible to every component)
2. Request arrives at Spring
3. security/JwtAuthFilter.java reads the header, validates the token,
   and if valid, places the user's ID on Spring Security's context
4. security/SecurityConfig.java checks: does this route require auth?
   - if yes and no valid token was set in step 3 → 401, request stops here
5. Request reaches the matching @RestController
6. Controller does ONE thing: delegates to a Service interface, wraps
   the result in Best4UResponse.ok(...)
7. Service implementation (in service/impl/) contains the actual business
   logic — validation beyond what annotations can express, calls to
   Repository interfaces, orchestration across multiple repositories
8. Repository (a Spring Data JPA interface) talks to Postgres
9. Entity objects never leave the service layer — a Mapper converts
   Entity → Response DTO before the controller ever sees it
10. If anything threw an exception anywhere in this chain,
    common/GlobalExceptionHandler.java catches it once, centrally,
    and formats it into the same Best4UResponse error shape
```

**The single most important rule this system follows:** a Controller **never** contains business logic, and a Service **never** talks to HTTP concepts (`HttpServletRequest`, path variables, etc.) or returns a raw JPA `@Entity`. That boundary is what makes every module in this project look identical once you understand one of them.

### 1.3 Why a modular monolith, not microservices

The original backend you inherited *was* structured as microservices (Eureka, an API Gateway, separate deployable services) — and it was audited early in this project and deliberately collapsed into one deployable app. The reasoning, briefly: microservices' entire value proposition is *independent* deployability, scaling, and data ownership per service. The original setup shared one Postgres database across "services" anyway, which means it was paying microservices' full operational cost (N deployments, network calls between services, service discovery) while getting **none** of the actual benefit (data isolation, independent scaling). A modular monolith gets you the same code organization (one package per domain) without that cost, and any single module can be extracted into its own service later, specifically once it has a real, measured reason to (e.g. Product catalog needs independent scaling under real traffic).

---

## PART 2 — Low-Level Design (LLD): the layering pattern every module follows

This is the part worth internalizing above everything else, because once you understand it for one module, you understand it for all ten.

```
<module>/
├── controller/     ← HTTP boundary only
├── service/        ← business logic CONTRACT (interface)
├── service/impl/   ← business logic IMPLEMENTATION
├── repository/     ← database access CONTRACT (Spring Data JPA interface)
├── entity/         ← the @Entity class(es) — the database's shape
└── dto/            ← Request/Response/Mapper — the API's shape
```

### 2.1 Why each layer exists, and what it must never do

| Layer | Responsibility | Must NOT do |
|---|---|---|
| **controller/** | Map an HTTP verb+path to a service call. Validate input shape (`@Valid`). Wrap the result. | Contain `if` statements about business rules. Touch a Repository directly. |
| **service/** (interface) | Declare *what* operations this domain supports, in business language (`checkout()`, `verifyOwnership()`), with no mention of HTTP or SQL. | Have any implementation code at all. |
| **service/impl/** | The actual logic: validation rules too complex for an annotation, orchestration across multiple repositories, transaction boundaries (`@Transactional`), calling external services (Razorpay). | Know anything about HTTP status codes directly (that's `ApiException`'s job) or about how data is displayed (that's the DTO's job). |
| **repository/** | Declare data-access operations as Spring Data JPA method names or `@Query` annotations. | Contain business logic. A repository method answers "how do I fetch/filter/mutate rows," never "should this be allowed." |
| **entity/** | Mirror the database table exactly — one class, one table, via JPA annotations. | Ever be returned directly from a controller. Ever contain a getter/setter for something that isn't a real column. |
| **dto/** | Define the *public API shape* — Request (what a client sends), Response (what a client receives), Mapper (the translation between Entity and DTO in both directions). | Be the same class as the Entity. Even if the fields look identical today, they answer different questions ("what's stored" vs. "what's exposed") and will diverge the moment either one needs to change independently. |

### 2.2 Why this specific shape, mapped to SOLID

- **Single Responsibility Principle (SRP)** — each layer has exactly one reason to change. A new validation rule touches `service/impl/` only. A new database index or query touches `repository/` only. A new field in the API response touches `dto/` only. Before this restructure, one flat class often did two or three of these jobs at once, so one change could ripple into unrelated code.
- **Dependency Inversion Principle (DIP)** — controllers depend on `service/TripService.java` (an interface), never on `service/impl/TripServiceImpl.java` (the concrete class) directly. Spring injects the real implementation at runtime via the constructor. This is what makes the implementation swappable (e.g., for a test, you could inject a fake `TripService` that never touches a real database) without touching the controller at all.
- **Interface Segregation** — each service interface only declares the operations that domain actually needs (`TripService` doesn't have a `sendEmail()` method bolted on because some other feature needed email once). Every interface in this codebase earns its place by being the actual contract a controller depends on — none of them exist "just to have an interface," which is why (for example) `docs/pdf/` and `docs/image/` have `service/`+`service/impl/` but deliberately have **no** `entity/`/`dto/` folders: those tools are stateless file transforms with no database row and no meaningful request/response shape beyond raw bytes, so forcing empty folders there would be structure for its own sake, not genuine abstraction.
- **Open/Closed Principle** — the Specification pattern (used in `travel/specification/TripSpecifications.java` and available for Product search) lets you add a new search filter (e.g., "search trips by date range") by adding a new method to the Specifications class and composing it with `.and(...)`, without modifying `TripServiceImpl`'s existing logic at all.

---

## PART 3 — Shared infrastructure (used by every module, live in `common/`, `security/`, `config/`)

### `common/Best4UResponse.java`
Generic response envelope. `Best4UResponse.ok(data)` / `Best4UResponse.error(message)` are the only two ways any controller in the app produces a response. This is why the frontend's `ApiResponse<T>` model never has to special-case any module.

### `common/ApiException.java` + `common/GlobalExceptionHandler.java`
`ApiException` carries an `HttpStatus` and a message — thrown anywhere in any `service/impl/` when a request can't be fulfilled for a known reason (`404`, `403`, `409`, etc.). `GlobalExceptionHandler`, annotated `@RestControllerAdvice`, intercepts **every** exception thrown by **every** controller in the app and formats it consistently. This is why no individual controller has a `try/catch` block anywhere in the codebase. It also has a dedicated handler for `MethodArgumentNotValidException` (Bean Validation failures — `@NotBlank`, `@Positive`, etc. — turn into a clean `400` with the specific field that failed) and `MaxUploadSizeExceededException` (oversized file uploads in Docs). Critically, the catch-all `Exception` handler logs the real error server-side but returns a **generic** message to the client — an earlier version of this leaked raw exception messages (potentially SQL errors, stack detail) straight into API responses, a real information-disclosure bug that's now fixed.

### `common/BaseEntity.java`
```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    @Id @GeneratedValue private Long id;
    @CreatedDate private Instant createdAt;
    @LastModifiedDate private Instant updatedAt;
}
```
Every single `@Entity` in this project extends this instead of hand-declaring its own `id`/`createdAt`/`updatedAt`. `@MappedSuperclass` is the correct JPA tool here — it contributes columns to each subclass's *own* table (there's no separate "base entity" table), which is why this isn't an interface: an interface can't carry `@Column`-generating fields. `@CreatedDate`/`@LastModifiedDate` are populated automatically by Spring Data JPA's auditing machinery (`config/JpaAuditingConfig.java`'s `@EnableJpaAuditing` is what turns this on app-wide) — no service anywhere manually sets a timestamp.

### `security/` package
- **`JwtService.java`** — creates and parses JWTs (`generateToken(userId)`, `extractUserId(token)`, `isValid(token)`).
- **`JwtAuthFilter.java`** — runs on every request, reads the `Authorization` header, and if the token is valid, sets the user's ID on Spring Security's context. This is a `OncePerRequestFilter`, meaning Spring guarantees it runs exactly once per request even in complex filter chains.
- **`SecurityConfig.java`** — the rulebook. Declares which route patterns are `permitAll()` (auth, product/category browsing, docs tools) vs. require authentication (everything else, via `anyRequest().authenticated()`).
- **`AuthUtil.java`** — a static helper every `service/impl/` calls to answer "who is making this request" (`AuthUtil.currentUserId()`). This is why no service anywhere trusts a `userId` field sent in a request body — the identity always comes from the verified token, never from client-supplied data.

---

## PART 4 — Module-by-module walkthrough

### 4.1 `user/` — accounts
`entity/User.java` (firstName, lastName, email, passwordHash, mobileNumber, roles) → `repository/UserRepository.java` → `service/UserService.java` (interface: `register`, `login`) → `service/impl/UserServiceImpl.java` (hashes passwords with BCrypt via `PasswordEncoder` — one-way, never reversible, which is why login *re-hashes* the submitted password and compares hashes rather than "decrypting" anything) → `controller/AuthController.java` (`POST /auth/register`, `POST /auth/login`).

**Known, deliberate gap:** `roles` exists on `User` (defaults to `["USER"]`) but nothing in the app checks it yet — this is exactly what Part 5's "next step" (role-based authorization) will close.

### 4.2 `category/` — flat product categories
`entity/Category.java` (name, slug) → the slug is *derived* from the name in `dto/CategoryMapper.java` (never user-typed), guaranteeing URL-safe, unique keys without asking anyone to think about URLs. Deliberately **flat**, not a hierarchical tree (`Electronics > Phones > Smartphones`) — a self-referencing tree is real added complexity that only pays for itself once the catalog is deep enough to need it. Migrating flat → tree later is a contained schema change, not a rewrite.

### 4.3 `product/` — the catalog
`entity/Product.java` adds `categoryId` (FK) and `stockQuantity` on top of name/description/price. The interesting file here is `repository/ProductRepository.java`:

```java
@Modifying
@Query("UPDATE Product p SET p.stockQuantity = p.stockQuantity - :qty " +
       "WHERE p.id = :id AND p.stockQuantity >= :qty")
int decrementStockIfAvailable(@Param("id") Long id, @Param("qty") int qty);
```

This is the single most important LLD lesson in the whole codebase: **why not just do `if (product.getStock() > 0) { product.setStock(stock - 1); save(); }` in Java?** Because two customers can both read `stock == 1` *before either one writes back* — a classic **time-of-check-to-time-of-use (TOCTOU) race condition**. Both requests would see "available," both would proceed, and the same unit would sell twice. Pushing the check into the `WHERE` clause makes it one atomic database statement: only one of two simultaneous `UPDATE`s can actually match the `stockQuantity >= :qty` condition and succeed. The method returns the number of rows affected — `1` means success, `0` means someone (possibly a concurrent request) already took the remaining stock. `incrementStock` is the mirror-image operation, used to restock an abandoned order (see §4.5).

### 4.4 `cart/` — per-user cart
No separate `Cart` entity — `entity/CartItem.java` (`userId`, `productId`, `quantity`) *is* the cart; "a user's cart" is just their `CartItem` rows, exactly the same reasoning as Work's `Todo`/`Habit` rows. A `@UniqueConstraint(columnNames = {"userId", "productId"})` enforces, at the database level, that adding the same product twice updates quantity rather than creating a duplicate row — `service/impl/CartServiceImpl.java`'s `addOrUpdateItem` relies on this. `dto/CartMapper.java` reads `Product` (a different domain's entity) purely to enrich the response with the product's current name/price for display — this is a deliberate, acceptable cross-domain **read** for presentation, distinct from a business-logic dependency, which is the line that keeps it from being a layering violation.

### 4.5 `order/` + `payment/` — checkout, the most complex module in the app

**The state machine** (`entity/OrderStatus.java`): `PENDING → PAID` (happy path) or `PENDING → FAILED` (payment failed/verification failed) or `PENDING → CANCELLED` (abandoned, see below). `SHIPPED`/`DELIVERED` exist for the fulfillment flow but nothing drives those transitions yet.

**The price-snapshot rule** (`entity/OrderItem.java`'s `priceAtPurchase`): copied from `Product.price` *at the moment of checkout*, never looked up live afterward. If a product's price changes next month, every historical order must keep showing what the customer actually paid — this is a domain rule, not an optimization, and it's a common real-world e-commerce bug when skipped.

**`service/impl/OrderServiceImpl.java`'s `checkout()` method** is the one place in the codebase that touches four different repositories inside a single `@Transactional` boundary: it reads the cart, calls `decrementStockIfAvailable` per item (throwing `409 Conflict` immediately if any item is out of stock — which, because the whole method is `@Transactional`, rolls back *any* stock already decremented earlier in the same loop for other items; an order is all-or-nothing, never partially placed), creates the `Order`+`OrderItem` rows, clears the cart, and finally calls out to Razorpay to open a payment order. If that last external call fails, the code deliberately sets the order to `FAILED` and lets the transaction **commit** (rather than roll back) — so a failed payment attempt is recorded, not silently lost.

**`verifyPayment()`** is the security-critical method: it calls `RazorpayService.verifySignature()`, which computes an HMAC over the order+payment IDs using Razorpay's secret key and compares it to what the client sent back. Without this check, anyone could call the "mark this order paid" endpoint directly with made-up IDs and get free products — the signature is the only proof a payment genuinely happened.

**`payment/service/RazorpayServiceImpl.java`** wraps the third-party SDK. Two things worth knowing cold: Razorpay's API expects amounts in **paise** (1/100 of a rupee), not rupees — multiplying by 100 is easy to forget and fails *silently* (the API call succeeds, just charges 100x too little); and the SDK's order-creation call is `client.orders.create(...)` — lowercase `orders`, a real gotcha caught via a compile error, not something to pattern-match from memory against other SDKs' conventions.

**`service/impl/AbandonedOrderCleanupJob.java`** — a `@Scheduled` job (enabled by `config/SchedulingConfig.java`'s `@EnableScheduling`) running every 10 minutes, restocking any order still `PENDING` more than 30 minutes after creation (the customer almost certainly closed the Razorpay widget without paying) and marking it `CANCELLED`. **Known limitation:** this assumes a single backend instance — if ever deployed as multiple instances, they'd all run this job independently and could double-process the same order. A distributed lock (e.g. the ShedLock library) is the standard fix, not needed at current scale.

### 4.6 `work/{todo,note,habit}/` — personal productivity tools
Three parallel modules, identical shape. The one non-obvious lesson lives in `note/`'s history: the *original* implementation called `POST /work/notes` (creating an empty database row) the instant a user clicked "+ New note," then called `DELETE` if they clicked Cancel without typing anything — two real network round-trips and a wasted insert-then-delete for an action that should cost zero server calls. **The fix wasn't a frontend patch — it was a domain rule**: `dto/NoteRequest.java` has an `@AssertTrue` validator (`isNotEmpty()`) that makes it structurally impossible to save a title-less, body-less note. Once the backend refuses empty notes, the frontend can safely hold a new note as pure local state and never call the server until the user actually clicks Save — the workaround code (create-then-delete) disappeared entirely because the rule it was compensating for was fixed at the source, not because the UI got cleverer.

### 4.7 `travel/` — trip planning, with a two-level ownership chain
`Trip` is the parent; `itinerary/`, `packing/`, `budget/`, `note/` are children scoped by `tripId`. Every child service calls `TripService.verifyOwnership(tripId)` before touching anything — one shared checkpoint instead of five different modules each re-implementing "does this trip belong to me." Within each child, item-level ownership uses `findByIdAndTripId(...)` (query-scoped) rather than `findById(...)` + manual comparison in Java — the same TOCTOU-avoidance principle as Product's stock decrement, applied to authorization instead of concurrency: collapsing "doesn't exist" and "exists but isn't yours" into the identical `404` response, rather than a `403` that would reveal a guessed ID is real, is a deliberate security choice (this is standard OWASP guidance, not an accident).

### 4.8 `docs/{pdf,image}/` — stateless file tools
The exception that proves the layering rule rather than breaking it: these have `controller/` and `service/`+`service/impl/`, but **no** `entity/` or `dto/` — there's no database row involved (files are processed in memory and streamed back immediately) and no JSON request/response shape beyond raw file bytes with a `Content-Disposition` header. Forcing empty `entity/`/`dto/` folders here would be cargo-culting the pattern rather than applying its actual reasoning.

---

## PART 5 — Design patterns actually used (and the ones deliberately not forced)

| Pattern | Where | Why it genuinely fits |
|---|---|---|
| **Specification** | `travel/specification/TripSpecifications.java` | Trip search has multiple independent, optional criteria (a keyword; more filters later) that need to combine with AND — the textbook use case for composable query predicates. |
| **Builder** | Every `*Response` DTO (via Lombok `@Value @Builder`) | Constructing a multi-field immutable object clearly (`TripResponse.builder().id(...).name(...)...build()`), instead of a constructor call with seven positional arguments that's easy to get wrong. |
| **Mapper** | Every `dto/*Mapper.java` | A single, explicit place where Entity↔DTO translation happens, so the database schema and the public API shape are free to evolve independently. |
| **Template-ish delegation** | `AuthUtil.currentUserId()`, `TripService.verifyOwnership()` | Shared "who is this, do they own this" logic pulled into one reusable call instead of copy-pasted per module. |

**Explicitly not used, and why:** Strategy, Factory, Observer, Adapter. None of these problems exist yet in this codebase — nothing has interchangeable algorithms selected at runtime (Strategy), complex conditional object construction (Factory), event-driven side effects (Observer), or two incompatible interfaces that need bridging (Adapter). Reaching for a pattern because it's a well-known name, rather than because its actual problem shape is present, produces code that's harder to follow for no real benefit — the opposite of what patterns are for.

---

## PART 6 — Known gaps (accurate as of this document — verify before assuming still true)

- `roles` exists on `User` but is enforced nowhere — any logged-in user can currently `POST /products` or `POST /categories`. This is the very next planned step.
- No order detail view or status-transition endpoints (`SHIPPED`/`DELIVERED` are declared but nothing sets them).
- No product reviews/ratings.
- Catalog search is category-filter only, no text search across name/description yet (the Specification pattern is already in place to extend for this).
- `AbandonedOrderCleanupJob` isn't safe for multi-instance deployment (see §4.5).
- JWTs have no refresh mechanism — they simply expire and require a fresh login.

---

## PART 7 — Frontend Architecture (Angular)

### 7.1 Structure

```
src/app/
├── core/           ← app-wide singletons: auth, interceptors, route guards, shared models
├── layout/          ← header, sidebar, category-bar — the global chrome on every page
├── shared/          ← reusable components/utilities with no single feature owner
├── assets/styles/    ← one SCSS partial per domain (_calculator.scss, _work.scss, _shop.scss...)
└── features/
    ├── auth/         ← login, register (now mostly superseded by the auth modal, see 7.3)
    ├── money/        ← BM4U calculators
    ├── work/          ← BW4U todos/notes/habits
    ├── travel/        ← BTr4U trip planning
    ├── docs/          ← BD4U file tools
    ├── code/          ← BC4U dev tools
    └── shop/          ← BP4U catalog/cart/checkout/orders
```

### 7.2 The shared `TabShell` pattern

Money, Work, Docs, and Code each used to have their own near-identical shell component (back link + tab bar + `<router-outlet>`), copy-pasted four times. `shared/components/tab-shell/tab-shell.ts` collapsed that into one component, parameterized by a `tabs` array and a `cssPrefix` (the domain's own BEM class prefix, e.g. `"calc-page"`, `"work-page"`) — each domain shell is now a ~10-line wrapper:

```typescript
@Component({
  selector: 'app-money-shell',
  imports: [TabShell],
  template: `<app-tab-shell [tabs]="tabs" cssPrefix="calc-page" ariaLabel="Money calculators" />`,
})
export class MoneyShell {
  protected readonly tabs: ShellTab[] = [ /* ... */ ];
}
```
This is composition over inheritance, deliberately: `TabShell` doesn't own any visual styling itself (its own `.scss` file just `@use`s every domain partial), so the actual look is still fully owned by each domain's own `_calc.scss`/`_work.scss`/etc. — the shared component only owns the *structure* (routing, tab rendering), never the *appearance*. `Travel`'s trip-level navigation and `Shop`'s catalog nav deliberately do **not** use `TabShell` — they have a genuinely different shape (a two-level parent/child route structure for Travel, category filters + cart/order actions rather than a flat tab list for Shop) — reusing the shell there would have been forcing a pattern onto a problem it doesn't fit, the same principle as not forcing a GoF design pattern where its actual problem shape isn't present.

### 7.3 Auth: signal-based state, not a stored-page flow

`core/auth/auth.service.ts` is the single source of truth for "who's logged in" — `currentUser` is a **signal**, not an RxJS `BehaviorSubject`, matching every other piece of state in this app. `core/interceptors/auth.interceptor.ts` attaches the JWT to every outgoing request automatically — no component anywhere manually adds an `Authorization` header. `core/interceptors/error.interceptor.ts` does the reverse: unwraps the backend's `Best4UResponse` error envelope into a plain `Error`, and — a real subtlety worth remembering — specifically handles the case where a failed request used `responseType: 'blob'` (Docs' file downloads): a blob request's *error* body also arrives as a Blob, not parsed JSON, so the interceptor reads it as text and parses it before falling back to a generic message.

Sign-in itself is a **modal** (`shared/components/auth-modal/`), not a routed page — `core/auth/auth-modal.service.ts` holds `isOpen`/`mode`/`redirectTo` as signals. `core/guards/auth.guard.ts` no longer redirects to a `/auth/login` route; it opens the modal directly on top of wherever the user currently is, remembering the URL they were trying to reach so the modal can send them there after a successful login.

### 7.4 The Shop module specifically

`features/shop/services/cart.service.ts` is the shared, signal-based cart state every cart-touching component reads/writes through — `ShopShell`'s badge, the `Cart` page, and every "Add to cart" button all stay in sync automatically because they share one signal, rather than each independently calling `HttpClient` with no way to notify each other of a change. This is the same signal-based-singleton-service pattern as `AuthService` (7.3), applied to a second domain.

`Checkout`'s component is a thin orchestrator around a global `Razorpay` class (loaded via a plain `<script>` tag in `index.html`, typed via `src/types/razorpay.d.ts` since the SDK ships no npm types) — it POSTs to `/orders/checkout`, opens Razorpay's widget with the returned order details, and on the widget's `handler` callback, POSTs the three fields Razorpay returns to `/orders/verify-payment` for server-side signature verification before ever treating the payment as real.
