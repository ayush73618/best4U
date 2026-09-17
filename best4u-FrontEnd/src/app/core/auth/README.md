# core/auth

Will hold the authentication state and logic: current user (as a signal),
login/logout/register methods calling the backend, and token storage.

**Blocked on:** the API contract (Step 3) and the backend password/roles
fixes (Track A), so this isn't built yet — building it against the current
broken/plaintext-password backend would just mean rebuilding it again.
