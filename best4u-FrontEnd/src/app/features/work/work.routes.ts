import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const WORK_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./work-shell/work-shell').then((m) => m.WorkShell),
    children: [
      { path: '', redirectTo: 'todos', pathMatch: 'full' },
      { path: 'todos', loadComponent: () => import('./todos/todos').then((m) => m.Todos) },
      { path: 'notes', loadComponent: () => import('./notes/notes').then((m) => m.Notes) },
      { path: 'habits', loadComponent: () => import('./habits/habits').then((m) => m.Habits) },
    ],
  },
];