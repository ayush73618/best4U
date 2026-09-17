import { Routes } from '@angular/router';

// Only one tool exists so far, so this routes straight to it. Once a
// second tool is added under BT4U, '' becomes a small tools-home listing
// page instead of jumping straight into the calculator.
export const TOOLS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../calculator/calculator').then((m) => m.Calculator),
  },
];