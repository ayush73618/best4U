import { Component } from '@angular/core';
import { TabShell, ShellTab } from '../../../shared/components/tab-shell/tab-shell';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [TabShell],
  template: `<app-tab-shell [tabs]="tabs" cssPrefix="admin-page" ariaLabel="Admin" />`,
})
export class AdminShell {
  protected readonly tabs: ShellTab[] = [
    { id: 'sellers', label: 'Seller applications', path: 'sellers' },
    { id: 'products', label: 'Product listings', path: 'products' },
    { id: 'orders', label: 'Orders', path: 'orders' },
  ];
}