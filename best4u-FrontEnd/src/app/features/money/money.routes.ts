import { Routes } from '@angular/router';

export const MONEY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./money-shell/money-shell').then((m) => m.MoneyShell),
    children: [
      { path: '', redirectTo: 'emi', pathMatch: 'full' },
      { path: 'emi', loadComponent: () => import('./emi-calculator/emi-calculator').then((m) => m.EmiCalculator) },
      { path: 'sip', loadComponent: () => import('./sip-calculator/sip-calculator').then((m) => m.SipCalculator) },
      { path: 'ppf', loadComponent: () => import('./ppf-calculator/ppf-calculator').then((m) => m.PpfCalculator) },
      { path: 'swp', loadComponent: () => import('./swp-calculator/swp-calculator').then((m) => m.SwpCalculator) },
      { path: 'rd', loadComponent: () => import('./rd-calculator/rd-calculator').then((m) => m.RdCalculator) },
      { path: 'fd', loadComponent: () => import('./fd-calculator/fd-calculator').then((m) => m.FdCalculator) },
    ],
  },
];