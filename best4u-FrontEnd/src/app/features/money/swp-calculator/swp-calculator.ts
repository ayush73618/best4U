import { Component, computed, inject,signal } from '@angular/core';
import { formatCurrency } from '../../../shared/utilities/currency';
import { CurrencyConfigService } from '../../../core/services/currency-config.service';
import { swpProjection, SwpResult } from '../../../core/services/financial-calc-engine';
import { formatINRFixed } from '../../../shared/utilities/currency';

@Component({
  selector: 'app-swp-calculator',
  standalone: true,
  templateUrl: './swp-calculator.html',
  styleUrl: './swp-calculator.scss',
})
export class SwpCalculator {
  protected readonly corpus = signal('');
  protected readonly monthlyWithdrawal = signal('');
  protected readonly expectedReturn = signal('');
  protected readonly tenureYears = signal('');

  protected readonly currencyConfig = inject(CurrencyConfigService);

  protected readonly validationMessage = computed<string | null>(() => {
    if (!this.corpus()) return null;
    const corpus = Number(this.corpus());
    if (!Number.isFinite(corpus) || corpus <= 0) return 'Enter a starting corpus greater than 0.';

    if (!this.monthlyWithdrawal()) return null;
    const withdrawal = Number(this.monthlyWithdrawal());
    if (!Number.isFinite(withdrawal) || withdrawal <= 0) return 'Enter a monthly withdrawal greater than 0.';
    if (withdrawal > corpus) return 'Monthly withdrawal can\u2019t exceed your starting corpus.';

    if (!this.expectedReturn()) return null;
    const rate = Number(this.expectedReturn());
    if (!Number.isFinite(rate) || rate < 0) return 'Expected return can\u2019t be negative.';
    if (rate > 30) return 'That expected return looks unusually high \u2014 double-check it.';

    if (!this.tenureYears()) return null;
    const years = Number(this.tenureYears());
    if (!Number.isFinite(years) || years <= 0) return 'Duration must be at least 1 year.';
    if (years > 40) return 'That duration looks unusually long \u2014 double-check it.';

    return null;
  });

  protected readonly result = computed<SwpResult | null>(() => {
    if (this.validationMessage()) return null;
    if (!this.corpus() || !this.monthlyWithdrawal() || !this.expectedReturn() || !this.tenureYears()) return null;

    return swpProjection(
      Number(this.corpus()),
      Number(this.monthlyWithdrawal()),
      Number(this.expectedReturn()),
      Number(this.tenureYears())
    );
  });

  protected readonly depletionMessage = computed<string | null>(() => {
    const r = this.result();
    if (!r || r.depletedAtMonth === null) return null;
    const years = Math.floor(r.depletedAtMonth / 12);
    const months = r.depletedAtMonth % 12;
    const parts: string[] = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
    return `At this withdrawal rate, your corpus runs out in ${parts.join(' ')} \u2014 before your selected duration ends.`;
  });

  protected readonly formattedClosingBalance = computed(() => {
    const r = this.result();
    return r ? formatINRFixed(r.closingBalance) : '\u2014';
  });

  protected readonly formattedTotalWithdrawn = computed(() => {
    const r = this.result();
    return r ? formatCurrency(r.totalWithdrawn, this.currencyConfig.current()) : '\u2014';
  });

  protected readonly formattedTotalInterest = computed(() => {
    const r = this.result();
    return r ? formatCurrency(r.totalInterestEarned, this.currencyConfig.current()) : '\u2014';
  });

  protected formatRowAmount(value: number): string {
    return formatCurrency(value, this.currencyConfig.current());
  }

  protected onCorpusInput(value: string): void {
    this.corpus.set(value);
  }

  protected onWithdrawalInput(value: string): void {
    this.monthlyWithdrawal.set(value);
  }

  protected onExpectedReturnInput(value: string): void {
    this.expectedReturn.set(value);
  }

  protected onTenureInput(value: string): void {
    this.tenureYears.set(value);
  }
}