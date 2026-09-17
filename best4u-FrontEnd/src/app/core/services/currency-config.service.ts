import { Injectable, signal } from '@angular/core';
import { CurrencyOption } from '../models/currency.model';

const STORAGE_KEY = 'best4u:currency';

@Injectable({ providedIn: 'root' })
export class CurrencyConfigService {
  // Add a currency here and every calculator across Best4U picks it up —
  // this is the one place a new currency is registered.
  readonly supported: readonly CurrencyOption[] = [
    { code: 'INR', symbol: '₹', locale: 'en-IN', label: 'Indian Rupee (₹)' },
    { code: 'USD', symbol: '$', locale: 'en-US', label: 'US Dollar ($)' },
    { code: 'EUR', symbol: '€', locale: 'en-IE', label: 'Euro (€)' },
    { code: 'GBP', symbol: '£', locale: 'en-GB', label: 'British Pound (£)' },
    { code: 'AED', symbol: 'د.إ', locale: 'ar-AE', label: 'UAE Dirham (د.إ)' },
    { code: 'SGD', symbol: 'S$', locale: 'en-SG', label: 'Singapore Dollar (S$)' },
  ];

  readonly current = signal<CurrencyOption>(this.loadInitial());

  setCurrency(code: string): void {
    const match = this.supported.find((c) => c.code === code);
    if (!match) return;
    this.current.set(match);
    localStorage.setItem(STORAGE_KEY, code);
  }

  private loadInitial(): CurrencyOption {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return this.supported.find((c) => c.code === saved) ?? this.supported[0]; // defaults to INR
  }
}