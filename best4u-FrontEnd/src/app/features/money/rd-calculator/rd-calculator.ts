import { Component, computed,inject, signal } from '@angular/core';
import { formatCurrency } from '../../../shared/utilities/currency';
import { CurrencyConfigService } from '../../../core/services/currency-config.service';
import { futureValueRD, GrowthResult } from '../../../core/services/financial-calc-engine';

@Component({
  selector: 'app-rd-calculator',
  standalone: true,
  templateUrl: './rd-calculator.html',
  styleUrl: './rd-calculator.scss',
})
export class RdCalculator {
  protected readonly monthlyAmount = signal('');
  protected readonly interestRate = signal('');
  protected readonly tenureMonths = signal('');
  protected readonly currencyConfig = inject(CurrencyConfigService);

  protected readonly validationMessage = computed<string | null>(() => {
    if (!this.monthlyAmount()) return null;
    const amount = Number(this.monthlyAmount());
    if (!Number.isFinite(amount) || amount <= 0) return 'Enter a monthly deposit greater than 0.';

    if (!this.interestRate()) return null;
    const rate = Number(this.interestRate());
    if (!Number.isFinite(rate) || rate < 0) return 'Interest rate can\u2019t be negative.';
    if (rate > 15) return 'That interest rate looks unusually high for an RD \u2014 double-check it.';

    if (!this.tenureMonths()) return null;
    const months = Number(this.tenureMonths());
    if (!Number.isFinite(months) || months < 6) return 'RD tenure is usually at least 6 months.';
    if (months > 120) return 'That tenure looks unusually long \u2014 double-check it.';

    return null;
  });

  protected readonly result = computed<GrowthResult | null>(() => {
    if (this.validationMessage()) return null;
    if (!this.monthlyAmount() || !this.interestRate() || !this.tenureMonths()) return null;

    return futureValueRD(Number(this.monthlyAmount()), Number(this.interestRate()), Number(this.tenureMonths()));
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

  protected onMonthlyAmountInput(value: string): void {
    this.monthlyAmount.set(value);
  }

  protected onInterestRateInput(value: string): void {
    this.interestRate.set(value);
  }

  protected onTenureInput(value: string): void {
    this.tenureMonths.set(value);
  }
}