import { Component, computed,inject, signal } from '@angular/core';
import { formatCurrency } from '../../../shared/utilities/currency';
import { CurrencyConfigService } from '../../../core/services/currency-config.service';
import { futureValueLumpsum, GrowthResult } from '../../../core/services/financial-calc-engine';

@Component({
  selector: 'app-fd-calculator',
  standalone: true,
  templateUrl: './fd-calculator.html',
  styleUrl: './fd-calculator.scss',
})
export class FdCalculator {
  protected readonly principal = signal('');
  protected readonly interestRate = signal('');
  protected readonly tenureYears = signal('');
  // Most Indian bank FDs compound quarterly by default.
  protected readonly compoundingPerYear = signal('4');
protected readonly currencyConfig = inject(CurrencyConfigService);
  protected readonly validationMessage = computed<string | null>(() => {
    if (!this.principal()) return null;
    const p = Number(this.principal());
    if (!Number.isFinite(p) || p <= 0) return 'Enter an amount greater than 0.';

    if (!this.interestRate()) return null;
    const rate = Number(this.interestRate());
    if (!Number.isFinite(rate) || rate < 0) return 'Interest rate can\u2019t be negative.';
    if (rate > 15) return 'That interest rate looks unusually high for an FD \u2014 double-check it.';

    if (!this.tenureYears()) return null;
    const years = Number(this.tenureYears());
    if (!Number.isFinite(years) || years <= 0) return 'Tenure must be greater than 0.';
    if (years > 20) return 'That tenure looks unusually long \u2014 double-check it.';

    return null;
  });

  protected readonly result = computed<GrowthResult | null>(() => {
    if (this.validationMessage()) return null;
    if (!this.principal() || !this.interestRate() || !this.tenureYears()) return null;

    return futureValueLumpsum(
      Number(this.principal()),
      Number(this.interestRate()),
      Number(this.tenureYears()),
      Number(this.compoundingPerYear())
    );
  });

  protected readonly formattedMaturity = computed(() => {
    const r = this.result();
    return r ? formatCurrency(r.maturityValue, this.currencyConfig.current()) : '\u2014';
  });

  protected readonly formattedPrincipal = computed(() => {
    const r = this.result();
    return r ? formatCurrency(r.investedAmount, this.currencyConfig.current()) : '\u2014';
  });

  protected readonly formattedReturns = computed(() => {
    const r = this.result();
    return r ? formatCurrency(r.estimatedReturns, this.currencyConfig.current()) : '\u2014';
  });

  protected onPrincipalInput(value: string): void {
    this.principal.set(value);
  }

  protected onInterestRateInput(value: string): void {
    this.interestRate.set(value);
  }

  protected onTenureInput(value: string): void {
    this.tenureYears.set(value);
  }

  protected onCompoundingChange(value: string): void {
    this.compoundingPerYear.set(value);
  }
}