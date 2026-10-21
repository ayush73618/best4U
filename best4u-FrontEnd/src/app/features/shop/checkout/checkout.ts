import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { AuthService } from '../../../core/auth/auth.service';
import { CheckoutResponse } from '../../../core/models/shop.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected readonly status = signal<'starting' | 'paying' | 'verifying' | 'error'>('starting');
  protected readonly errorMessage = signal<string | null>(null);

    constructor(private cartService: CartService) {}
  
  ngOnInit(): void {
    this.startCheckout();
  }

  private startCheckout(): void {
    this.status.set('starting');
    this.http.post<ApiResponse<CheckoutResponse>>(`${environment.apiBaseUrl}/orders/checkout`, {}).subscribe({
      next: (res) => {
        this.cartService.clear();
        this.openRazorpay(res.data);
      },
      error: (err) => {
        this.status.set('error');
        this.errorMessage.set(err.message);
      },
    });
  }

  private openRazorpay(checkout: CheckoutResponse): void {
    this.status.set('paying');

    const user = this.authService.currentUser();

    const razorpay = new Razorpay({
      key: checkout.razorpayKeyId,
      amount: Math.round(checkout.amount * 100), // paise
      currency: 'INR',
      order_id: checkout.razorpayOrderId,
      name: 'Best4U',
      description: `Order #${checkout.orderId}`,
      prefill: {
        name: user ? `${user.firstName} ${user.lastName}` : undefined,
        email: user?.email,
      },
      theme: { color: '#0d4f4a' },
      handler: (response) => this.verifyPayment(response),
      modal: {
        ondismiss: () => {
          // User closed the widget without paying - order stays PENDING
          // server-side; nothing to clean up here, they can retry from Orders.
          this.status.set('error');
          this.errorMessage.set('Payment was cancelled.');
        },
      },
    });

    razorpay.open();
  }

  private verifyPayment(response: RazorpayPaymentResponse): void {
    this.status.set('verifying');

    this.http
      .post<ApiResponse<void>>(`${environment.apiBaseUrl}/orders/verify-payment`, {
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      })
      .subscribe({
        next: () => this.router.navigateByUrl('/shop/orders'),
        error: (err) => {
          this.status.set('error');
          this.errorMessage.set(err.message);
        },
      });
  }

  protected retry(): void {
    this.startCheckout();
  }
}