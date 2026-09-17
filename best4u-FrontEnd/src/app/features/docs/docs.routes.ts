import { Routes } from '@angular/router';

export const DOCS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./docs-shell/docs-shell').then((m) => m.DocsShell),
    children: [
      { path: '', redirectTo: 'merge', pathMatch: 'full' },
      { path: 'merge', loadComponent: () => import('./pdf-merge/pdf-merge').then((m) => m.PdfMerge) },
      { path: 'split', loadComponent: () => import('./pdf-split/pdf-split').then((m) => m.PdfSplit) },
      { path: 'compress', loadComponent: () => import('./pdf-compress/pdf-compress').then((m) => m.PdfCompress) },
      { path: 'image', loadComponent: () => import('./image-tools/image-tools').then((m) => m.ImageTools) },
    ],
  },
];