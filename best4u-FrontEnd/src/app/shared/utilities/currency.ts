import { CurrencyOption } from '../../core/models/currency.model';

/**
 * Formats a number using whichever CurrencyOption is passed in — no longer
 * hardcoded to INR. This only changes DISPLAY (symbol, locale grouping);
 * it does not convert the underlying value. See chat for why real
 * conversion is a separate decision requiring a live exchange-rate source.
 */
export function formatCurrency(value: number, currency: CurrencyOption): string {
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    maximumFractionDigits: 0,
  }).format(value);
}

// India-specific regulatory limits (e.g. PPF's ₹1,50,000 annual cap) are
// fixed in law, in Rupees — never affected by the user's display-currency
// choice. Use this instead of formatCurrency() for that narrow case.
export function formatINRFixed(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}