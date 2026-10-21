// features/code/code.routes.ts (new)
import { Routes } from '@angular/router';

export const CODE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./code-shell/code-shell').then((m) => m.CodeShell),
    children: [
      { path: '', redirectTo: 'json', pathMatch: 'full' },
      { path: 'json', loadComponent: () => import('./json-formatter/json-formatter').then((m) => m.JsonFormatter) },
      { path: 'jwt', loadComponent: () => import('./jwt-decoder/jwt-decoder').then((m) => m.JwtDecoder) },
      { path: 'base64', loadComponent: () => import('./base64-tool/base64-tool').then((m) => m.Base64Tool) },
      { path: 'uuid', loadComponent: () => import('./uuid-generator/uuid-generator').then((m) => m.UuidGenerator) },
      { path: 'hash', loadComponent: () => import('./hash-generator/hash-generator').then((m) => m.HashGenerator) },
      { path: 'timestamp', loadComponent: () => import('./timestamp-converter/timestamp-converter').then((m) => m.TimestampConverter) },
      { path: 'regex', loadComponent: () => import('./regex-tester/regex-tester').then((m) => m.RegexTester) },
      { path: 'url', loadComponent: () => import('./url-encoder/url-encoder').then((m) => m.UrlEncoder) },
      { path: 'case', loadComponent: () => import('./case-converter/case-converter').then((m) => m.CaseConverter) },
      { path: 'color', loadComponent: () => import('./color-converter/color-converter').then((m) => m.ColorConverter) },
    ],
  },
];