import { Component, computed, inject,signal } from '@angular/core';
import { round } from '../../../core/services/financial-calc-engine'; 
import { formatCurrency } from '../../../shared/utilities/currency';
import { CurrencyConfigService } from '../../../core/services/currency-config.service';

interface EmiResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  principal: number;
  principalPercent: number;
  interestPercent: number;
}

@Component({
  selector: 'app-emi-calculator',
  standalone: true,
  imports: [],
  templateUrl: './emi-calculator.html',
  styleUrl: './emi-calculator.scss',
})
export class EmiCalculator {
  protected readonly loanAmount = signal('');
  protected readonly interestRate = signal('');
  protected readonly tenureYears = signal('');

  protected readonly currencyConfig = inject(CurrencyConfigService);
  
  protected readonly validationMessage = computed<string | null>(() => {
    if (!this.loanAmount()) return null;
    const p = Number(this.loanAmount());
    if (!Number.isFinite(p) || p <= 0) return 'Enter a loan amount greater than 0.';

    if (!this.interestRate()) return null;
    const rate = Number(this.interestRate());
    if (!Number.isFinite(rate) || rate < 0) return 'Interest rate can\u2019t be negative.';
    if (rate > 50) return 'That interest rate looks unusually high \u2014 double-check it.';

    if (!this.tenureYears()) return null;
    const years = Number(this.tenureYears());
    if (!Number.isFinite(years) || years <= 0) return 'Tenure must be at least 1 year.';
    if (years > 40) return 'That tenure looks unusually long \u2014 double-check it.';

    return null;
  });

  protected readonly result = computed<EmiResult | null>(() => {
    if (this.validationMessage()) return null;
    if (!this.loanAmount() || !this.interestRate() || !this.tenureYears()) return null;

    const p = Number(this.loanAmount());
    const annualRate = Number(this.interestRate());
    const years = Number(this.tenureYears());
    const n = years * 12;
    const r = annualRate / 12 / 100;

    const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    return {
      emi: round(emi),
      totalPayment: round(totalPayment),
      totalInterest: round(totalInterest),
      principal: p,
      principalPercent: (p / totalPayment) * 100,
      interestPercent: (totalInterest / totalPayment) * 100,
    };
  });

  protected readonly formattedEmi = computed(() => {
    const r = this.result();
    return r ? formatCurrency(r.emi, this.currencyConfig.current()) : '\u2014';
  });

  protected readonly formattedTotalInterest = computed(() => {
    const r = this.result();
    return r ? formatCurrency(r.totalInterest, this.currencyConfig.current()) : '\u2014';
  });

  protected readonly formattedTotalPayment = computed(() => {
    const r = this.result();
    return r ? formatCurrency(r.totalPayment, this.currencyConfig.current()) : '\u2014';
  });

  protected readonly formattedPrincipal = computed(() => {
    const r = this.result();
    return r ? formatCurrency(r.principal, this.currencyConfig.current()) : '\u2014';
  });

  protected onLoanAmountInput(value: string): void {
    this.loanAmount.set(value);
  }

  protected onInterestRateInput(value: string): void {
    this.interestRate.set(value);
  }

  protected onTenureInput(value: string): void {
    this.tenureYears.set(value);
  }
}