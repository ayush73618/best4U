# core/guards

Route guards: `authGuard` (require login) and `roleGuard` (require a
specific role/authority, matching the backend's ROLES.txt permission model —
e.g. `PRODUCT_CREATE` for seller-only routes).

**Blocked on:** core/auth existing first.
