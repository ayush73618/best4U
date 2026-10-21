// Razorpay's Checkout.js is loaded via a plain <script> tag (see index.html
// below), so it exists as a global at runtime with no npm types shipped -
// this declaration just tells TypeScript that global exists.
declare class Razorpay {
  constructor(options: RazorpayOptions);
  open(): void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name?: string;
  description?: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}