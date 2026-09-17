import { Component, computed,inject, signal } from '@angular/core';
import { formatCurrency,formatINRFixed  } from '../../../shared/utilities/currency';
import { CurrencyConfigService } from '../../../core/services/currency-config.service';
import { futureValuePPF, GrowthResult } from '../../../core/services/financial-calc-engine';

@Component({
  selector: 'app-ppf-calculator',
  standalone: true,
  templateUrl: './ppf-calculator.html',
  styleUrl: './ppf-calculator.scss',
})
export class PpfCalculator {
  protected readonly yearlyAmount = signal('');
  // Government-set, revised quarterly — prefilled with the current published
  // rate but left editable so this doesn't silently go stale.
  protected readonly interestRate = signal('7.1');
  protected readonly tenureYears = signal('15');
  protected readonly minDepositLabel = formatINRFixed(500);
  protected readonly maxDepositLabel = formatINRFixed(150000);

  protected readonly currencyConfig = inject(CurrencyConfigService);

  protected readonly validationMessage = computed<string | null>(() => {
    if (!this.yearlyAmount()) return null;
    const amount = Number(this.yearlyAmount());
    if (!Number.isFinite(amount) || amount <= 0) return 'Enter a yearly deposit greater than 0.';
    if (amount < 500) return 'PPF requires a minimum deposit of \u20b9500 per year.';
    if (amount > 150000) return 'PPF allows a maximum deposit of \u20b91,50,000 per year.';

    if (!this.interestRate()) return null;
    const rate = Number(this.interestRate());
    if (!Number.isFinite(rate) || rate <= 0) return 'Enter a valid interest rate.';
    if (rate > 15) return 'That interest rate looks unusually high for PPF \u2014 double-check it.';

    if (!this.tenureYears()) return null;
    const years = Number(this.tenureYears());
    if (!Number.isFinite(years) || years < 15) return 'PPF has a minimum lock-in of 15 years.';
    if (years > 50) return 'That tenure looks unusually long \u2014 double-check it.';

    return null;
  });

  protected readonly result = computed<GrowthResult | null>(() => {
    if (this.validationMessage()) return null;
    if (!this.yearlyAmount() || !this.interestRate() || !this.tenureYears()) return null;

    return futureValuePPF(Number(this.yearlyAmount()), Number(this.tenureYears()), Number(this.interestRate()));
  });

  protected readonly formattedMaturity = computed(() => {
    const r = this.result();
    return r ? formatCurrency(r.maturityValue, this.currencyConfig.current()) : '\u2014';
  });

  protected readonly formattedInvested = computed(() => {
    const r = this.result();
    return r ? formatCurrency(r.investedAmount, this.currencyConfig.current()) : '\u2014';
  });

  protected readonly formattedReturns = computed(() => {
    const r = this.result();
    return r ? formatCurrency(r.estimatedReturns, this.currencyConfig.current()) : '\u2014';
  });

  protected onYearlyAmountInput(value: string): void {
    this.yearlyAmount.set(value);
  }

  protected onInterestRateInput(value: string): void {
    this.interestRate.set(value);
  }

  protected onTenureInput(value: string): void {
    this.tenureYears.set(value);
  }
}