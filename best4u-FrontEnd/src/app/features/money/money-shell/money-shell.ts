import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CurrencySwitcher } from '../../../shared/components/currency-switcher/currency-switcher';

@Component({
  selector: 'app-money-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CurrencySwitcher],
  templateUrl: './money-shell.html',
  styleUrl: './money-shell.scss',
})
export class MoneyShell {
  protected readonly calculators = [
    { id: 'emi', label: 'EMI', path: 'emi' },
    { id: 'sip', label: 'SIP', path: 'sip' },
    { id: 'ppf', label: 'PPF', path: 'ppf' },
    { id: 'swp', label: 'SWP', path: 'swp' },
    { id: 'rd', label: 'RD', path: 'rd' },
    { id: 'fd', label: 'FD', path: 'fd' },
  ];
}