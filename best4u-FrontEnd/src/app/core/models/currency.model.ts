export interface CurrencyOption {
  code: string;   // ISO 4217, e.g. 'INR'
  symbol: string; // e.g. '₹'
  locale: string; // e.g. 'en-IN'
  label: string;  // shown in the dropdown, e.g. 'Indian Rupee (₹)'
}