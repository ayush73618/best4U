import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./admin-shell/admin-shell').then((m) => m.AdminShell),
    children: [
      { path: '', redirectTo: 'sellers', pathMatch: 'full' },
      {
        path: 'sellers',
        loadComponent: () =>
          import('./seller-queue/seller-queue').then((m) => m.SellerQueue),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./product-queue/product-queue').then((m) => m.ProductQueue),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./order-management/order-management').then(
            (m) => m.OrderManagement
          ),
      },
    ],
  },
];