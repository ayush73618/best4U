import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { sellerGuard } from '../../core/guards/seller.guard';

export const SHOP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./shop-shell/shop-shell').then((m) => m.ShopShell),
    children: [
      { path: '', loadComponent: () => import('./product-list/product-list').then((m) => m.ProductList) },
      { path: 'products/:id', loadComponent: () => import('./product-detail/product-detail').then((m) => m.ProductDetail) },
      { path: 'cart', canActivate: [authGuard], loadComponent: () => import('./cart/cart').then((m) => m.Cart) },
      { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./checkout/checkout').then((m) => m.Checkout) },
      { path: 'orders', canActivate: [authGuard], loadComponent: () => import('./orders/orders').then((m) => m.Orders) },
      { path: 'sell', canActivate: [sellerGuard], loadComponent: () => import('./sell-product/sell-product').then((m) => m.SellProduct) },
      { path: 'my-listings', canActivate: [sellerGuard], loadComponent: () => import('./my-listings/my-listings').then((m) => m.MyListings) },
    ],
  },
];