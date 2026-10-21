import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { ApiResponse } from "../../../core/models/api-response.model";
import { Order, OrderItem, Page } from "../../../core/models/shop.model";
import { ImageService } from "../../../core/services/image.service";
import { RouterLink } from "@angular/router";
import { EmptyState } from "../../../shared/components/empty-state/empty-state";
import { Skeleton } from "../../../shared/components/skeleton/skeleton";

@Component({
  selector: "app-orders",
  standalone: true,
  imports: [CommonModule, EmptyState, Skeleton, RouterLink],
  templateUrl: "./orders.html",
  styleUrl: "./orders.scss",
})
export class Orders implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly imageService = inject(ImageService);

  protected readonly orders = signal<Order[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.http
      .get<ApiResponse<Page<Order>>>(`${environment.apiBaseUrl}/orders`)
      .subscribe((res) => {
        this.orders.set(res.data.content);
        this.loading.set(false);
      });
  }

  protected imageFor(item: OrderItem): string {
    return this.imageService.resolveFirst(
      item.imageUrl ? [item.imageUrl] : [],
      "https://placehold.co/48x48/e8e8e8/999999?text=%20",
    );
  }

  protected statusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: "Payment pending",
      PAID: "Order confirmed",
      FAILED: "Payment failed",
      CANCELLED: "Cancelled",
      SHIPPED: "Shipped",
      DELIVERED: "Delivered",
    };
    return labels[status] ?? status;
  }

  // Shows the next expected state so the user knows what to anticipate.
  protected nextStep(status: string): string | null {
    const next: Record<string, string> = {
      PAID: "Your order will be shipped soon.",
      SHIPPED: "Expected delivery in 2–5 business days.",
    };
    return next[status] ?? null;
  }

  // A step is "done" if the order has passed it in the state machine,
  // not counting PAID as done when status is still PAID itself, etc.
  protected isDone(orderStatus: string, step: string): boolean {
    const order = ["PAID", "SHIPPED", "DELIVERED"];
    return order.indexOf(orderStatus) > order.indexOf(step);
  }
}
