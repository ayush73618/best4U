export const environment = {
  production: false,
  // Placeholder — will point at the consolidated Spring Boot monolith once
  // Track A (backend) lands and the API contract (Step 3) is written.
  apiBaseUrl: 'http://localhost:8080/api',
  serverOrigin: 'http://localhost:8080', // origin only, no /api — used to resolve locally-stored image paths
};
