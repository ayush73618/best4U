export const environment = {
  production: true,
  // To be set once a real hosting target exists — never hardcode this
  // elsewhere in the app (Section 33: never hardcode environment values).
  apiBaseUrl: '/api',
  serverOrigin: 'http://localhost:8080', // origin only, no /api — used to resolve locally-stored image paths
};
