import { Component, computed,inject, signal } from '@angular/core';
import { formatCurrency } from '../../../shared/utilities/currency';
import { CurrencyConfigService } from '../../../core/services/currency-config.service';
import { futureValueSIP, futureValueStepUpSIP, GrowthResult } from '../../../core/services/financial-calc-engine';

@Component({
  selector: 'app-sip-calculator',
  standalone: true,
  imports: [],
  templateUrl: './sip-calculator.html',
  styleUrl: './sip-calculator.scss',
})
export class SipCalculator {
  protected readonly monthlyAmount = signal('');
  protected readonly expectedReturn = signal('');
  protected readonly tenureYears = signal('');
  protected readonly stepUpEnabled = signal(false);
  protected readonly stepUpPercent = signal('');

    protected readonly currencyConfig = inject(CurrencyConfigService);

  protected readonly validationMessage = computed<string | null>(() => {
    if (!this.monthlyAmount()) return null;
    const amount = Number(this.monthlyAmount());
    if (!Number.isFinite(amount) || amount <= 0) return 'Enter a monthly amount greater than 0.';

    if (!this.expectedReturn()) return null;
    const rate = Number(this.expectedReturn());
    if (!Number.isFinite(rate) || rate < 0) return 'Expected return can\u2019t be negative.';
    if (rate > 30) return 'That expected return looks unusually high \u2014 double-check it.';

    if (!this.tenureYears()) return null;
    const years = Number(this.tenureYears());
    if (!Number.isFinite(years) || years <= 0) return 'Tenure must be at least 1 year.';
    if (years > 40) return 'That tenure looks unusually long \u2014 double-check it.';

    if (this.stepUpEnabled() && this.stepUpPercent()) {
      const stepUp = Number(this.stepUpPercent());
      if (!Number.isFinite(stepUp) || stepUp < 0) return 'Step-up can\u2019t be negative.';
      if (stepUp > 50) return 'That step-up looks unusually high \u2014 double-check it.';
    }

    return null;
  });

  protected readonly result = computed<GrowthResult | null>(() => {
    if (this.validationMessage()) return null;
    if (!this.monthlyAmount() || !this.expectedReturn() || !this.tenureYears()) return null;

    const amount = Number(this.monthlyAmount());
    const rate = Number(this.expectedReturn());
    const years = Number(this.tenureYears());

    if (this.stepUpEnabled() && this.stepUpPercent()) {
      const stepUp = Number(this.stepUpPercent());
      return futureValueStepUpSIP(amount, rate, years, stepUp);
    }

    return futureValueSIP(amount, rate, years);
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

  protected onExpectedReturnInput(value: string): void {
    this.expectedReturn.set(value);
  }

  protected onTenureInput(value: string): void {
    this.tenureYears.set(value);
  }

  protected onStepUpToggle(checked: boolean): void {
    this.stepUpEnabled.set(checked);
    if (!checked) this.stepUpPercent.set('');
  }

  protected onStepUpInput(value: string): void {
    this.stepUpPercent.set(value);
  }
}