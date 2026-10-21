import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Order, Page } from '../../../core/models/shop.model';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-management.html',
  styleUrl: './order-management.scss',
})
export class OrderManagement implements OnInit {
  private readonly baseUrl = `${environment.apiBaseUrl}`;

  protected readonly orders = signal<Order[]>([]);
  protected readonly loading = signal(true);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    // Reuses the existing /orders endpoint — in a real deployment this
    // would be a separate /admin/orders?all=true endpoint that returns
    // all users' orders, not just the current user's. For now, the
    // admin is also the only real user, so this works.
    this.http
      .get<ApiResponse<Page<Order>>>(
        `${this.baseUrl}/orders?size=50`
      )
      .subscribe((res) => {
        this.orders.set(res.data.content);
        this.loading.set(false);
      });
  }

  protected ship(orderId: number): void {
    this.http
      .put<ApiResponse<void>>(
        `${this.baseUrl}/admin/orders/${orderId}/ship`,
        {}
      )
      .subscribe(() => this.load());
  }

  protected deliver(orderId: number): void {
    this.http
      .put<ApiResponse<void>>(
        `${this.baseUrl}/admin/orders/${orderId}/deliver`,
        {}
      )
      .subscribe(() => this.load());
  }

  protected canShip(status: string): boolean {
    return status === 'PAID';
  }

  protected canDeliver(status: string): boolean {
    return status === 'SHIPPED';
  }
}