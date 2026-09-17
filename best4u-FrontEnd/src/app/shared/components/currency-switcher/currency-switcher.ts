import { Component, inject } from '@angular/core';
import { CurrencyConfigService } from '../../../core/services/currency-config.service';

@Component({
  selector: 'app-currency-switcher',
  standalone: true,
  templateUrl: './currency-switcher.html',
  styleUrl: './currency-switcher.scss',
})
export class CurrencySwitcher {
  protected readonly currencyConfig = inject(CurrencyConfigService);

  protected onChange(code: string): void {
    this.currencyConfig.setCurrency(code);
  }
}