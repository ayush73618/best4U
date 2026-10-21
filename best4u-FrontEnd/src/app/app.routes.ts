import { Routes } from "@angular/router";

// Every feature module is lazy-loaded and self-contained under features/.
// Adding a new module (tools, finance, productivity, ...) means adding one
// entry here that points to that feature's own route file — nothing else
// in this file should need to change.
export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./features/home/home").then((m) => m.Home),
  },
  {
    path: "tools",
    loadChildren: () =>
      import("./features/tools/tools.routes").then((m) => m.TOOLS_ROUTES),
  },
  {
    path: "money",
    loadChildren: () =>
      import("./features/money/money.routes").then((m) => m.MONEY_ROUTES),
  },
  {
    path: "work",
    loadChildren: () =>
      import("./features/work/work.routes").then((m) => m.WORK_ROUTES),
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./features/auth/auth.routes").then((m) => m.AUTH_ROUTES),
  },
  {
    path: "docs",
    loadChildren: () =>
      import("./features/docs/docs.routes").then((m) => m.DOCS_ROUTES),
  },
  // app.routes.ts — add one entry
  {
    path: "code",
    loadChildren: () =>
      import("./features/code/code.routes").then((m) => m.CODE_ROUTES),
  },
  {
    path: "travel",
    loadChildren: () =>
      import("./features/travel/travel.routes").then((m) => m.TRAVEL_ROUTES),
  },
  {
    path: "shop",
    loadChildren: () =>
      import("./features/shop/shop.routes").then((m) => m.SHOP_ROUTES),
  },
  {
    path: "sell",
    loadComponent: () =>
      import("./features/sell/sell-landing/sell-landing").then(
        (m) => m.SellLanding,
      ),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./features/admin/admin.routes").then((m) => m.ADMIN_ROUTES),
  },
  {
    path: "profile",
    loadComponent: () =>
      import("./features/profile/profile").then((m) => m.Profile),
  },
  // Coming in the next steps, once core/auth + the backend API contract exist:
  // {
  //   path: 'login',
  //   loadComponent: () => import('./features/auth/login').then((m) => m.Login),
  // },
  // {
  //   path: 'register',
  //   loadComponent: () => import('./features/auth/register').then((m) => m.Register),
  // },

  // Future modules, added one at a time as each phase is built:
  // {
  //   path: 'shopping',
  //   loadChildren: () => import('./features/shopping/shopping.routes').then((m) => m.SHOPPING_ROUTES),
  // },
  // { path: 'tools', loadChildren: () => import('./features/tools/tools.routes').then((m) => m.TOOLS_ROUTES) },
  // { path: 'finance', loadChildren: () => import('./features/finance/finance.routes').then((m) => m.FINANCE_ROUTES) },
];
