import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Router, RouterLink } from "@angular/router";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../../core/models/api-response.model";
import { AuthService } from "../../core/auth/auth.service";
import { BrandRegistryService } from "../../core/services/brand-registry.service";
import { CartService } from "../../core/services/cart.service";
import { ImageService } from "../../core/services/image.service";
import { Order, Page, Product } from "../../core/models/shop.model";

const BRAND_ICONS: Record<string, string | undefined> = {
  bp4u: "🛍️",
  bf4u: "🍔",
  bg4u: "🥬",
  bau4u: "🪙",
  bt4u: "🧮",
  bm4u: "💰",
  bw4u: "✅",
  bd4u: "📄",
  bc4u: "💻",
  btr4u: "✈️",
};

interface QuickCard {
  label: string;
  value: string;
  sub: string;
  route: string;
}

@Component({
  selector: "app-home",
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: "./home.html",
  styleUrl: "./home.scss",
})
export class Home implements OnInit {
  protected readonly registry = inject(BrandRegistryService);
  protected readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly imageService = inject(ImageService);

  protected readonly heroQuery = signal("");
  protected readonly featuredProducts = signal<Product[]>([]);
  protected readonly quickCards = signal<QuickCard[]>([]);
  protected readonly BRAND_ICONS = BRAND_ICONS;

  ngOnInit(): void {
    this.http
      .get<
        ApiResponse<Page<Product>>
      >(`${environment.apiBaseUrl}/products?size=4&sort=createdAt,desc`)
      .subscribe((res) => this.featuredProducts.set(res.data.content));

    if (this.authService.isAuthenticated()) {
      this.buildQuickCards();
    }
  }

  private buildQuickCards(): void {
    const cards: QuickCard[] = [];
    const count = this.cartService.itemCount();
    if (count > 0) {
      cards.push({
        label: "Cart",
        value: `${count} item${count > 1 ? "s" : ""}`,
        sub: "Ready to checkout →",
        route: "/shop/cart",
      });
    }
    this.quickCards.set(cards);

    this.http
      .get<ApiResponse<Page<Order>>>(`${environment.apiBaseUrl}/orders?size=1`)
      .subscribe((res) => {
        const latest = res.data.content[0];
        if (latest) {
          this.quickCards.update((c) => [
            ...c,
            {
              label: "Last order",
              value: `#${latest.id}`,
              sub: this.statusLabel(latest.status),
              route: "/shop/orders",
            },
          ]);
        }
      });
  }

  protected heroSearch(): void {
    const q = this.heroQuery().trim();
    if (!q) return;
    this.router.navigate(["/shop"], { queryParams: { search: q } });
  }

  protected onHeroKey(event: KeyboardEvent): void {
    if (event.key === "Enter") this.heroSearch();
  }

  protected imageFor(product: Product): string {
    return this.imageService.resolveFirst(
      product.imageUrls,
      "https://placehold.co/300x300/f4f6f5/9ab0ac?text=No+Image",
    );
  }

  protected stars(rating: number): string {
    return "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
  }

  private statusLabel(status: string): string {
    const m: Record<string, string> = {
      PAID: "Confirmed",
      SHIPPED: "On its way",
      DELIVERED: "Delivered",
      PENDING: "Pending",
      FAILED: "Failed",
      CANCELLED: "Cancelled",
    };
    return m[status] ?? status;
  }
}
