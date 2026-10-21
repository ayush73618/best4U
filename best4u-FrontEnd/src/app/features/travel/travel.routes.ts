import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const TRAVEL_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./trips-list/trips-list').then((m) => m.TripsList) },
      {
        path: ':tripId',
        loadComponent: () => import('./trip-shell/trip-shell').then((m) => m.TripShell),
        children: [
          { path: '', redirectTo: 'itinerary', pathMatch: 'full' },
          { path: 'itinerary', loadComponent: () => import('./itinerary/itinerary').then((m) => m.Itinerary) },
          { path: 'packing', loadComponent: () => import('./packing/packing').then((m) => m.Packing) },
          { path: 'budget', loadComponent: () => import('./budget/budget').then((m) => m.Budget) },
          { path: 'notes', loadComponent: () => import('./trip-notes/trip-notes').then((m) => m.TripNotes) },
        ],
      },
    ],
  },
];