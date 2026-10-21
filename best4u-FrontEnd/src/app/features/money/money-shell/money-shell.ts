import { Component } from '@angular/core';
import { TabShell, ShellTab } from '../../../shared/components/tab-shell/tab-shell';

@Component({
  selector: 'app-money-shell',
  standalone: true,
  imports: [TabShell],
  template: `<app-tab-shell [tabs]="tabs" cssPrefix="calc-page" ariaLabel="Money calculators" umbrella="utilities" currentBrandId="bm4u" />`,
})
export class MoneyShell {
  protected readonly tabs: ShellTab[] = [
    { id: 'emi', label: 'EMI', path: 'emi' },
    { id: 'sip', label: 'SIP', path: 'sip' },
    { id: 'ppf', label: 'PPF', path: 'ppf' },
    { id: 'swp', label: 'SWP', path: 'swp' },
    { id: 'rd', label: 'RD', path: 'rd' },
    { id: 'fd', label: 'FD', path: 'fd' },
  ];
}