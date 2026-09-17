# core/interceptors

HTTP interceptors, registered in `app.config.ts`:
- **authInterceptor** — attaches the JWT to outgoing requests.
- **errorInterceptor** — turns raw HTTP/server errors into the plain-language
  messages the UI shows (Section 24: never surface a raw stack trace/500 to
  the user).

**Blocked on:** core/auth (for the token) and the API contract (for the
error response shape).
