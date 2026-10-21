import { Component, OnInit, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CartService } from "../../../core/services/cart.service";
import { DecimalPipe } from "@angular/common";
import { ImageService } from "../../../core/services/image.service";
import { CartItem } from "../../../core/models/shop.model";
import { EmptyState } from "../../../shared/components/empty-state/empty-state";

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [RouterLink, DecimalPipe, EmptyState],
  templateUrl: "./cart.html",
  styleUrl: "./cart.scss",
})
export class Cart implements OnInit {
  protected readonly cartService = inject(CartService);
  protected readonly imageService = inject(ImageService);
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.cartService.loadCart();
  }

  protected updateQuantity(productId: number, value: string): void {
    const qty = Number(value);
    if (!Number.isFinite(qty) || qty < 1) return;
    this.cartService.addOrUpdateItem(productId, qty).subscribe();
  }

  protected removeItem(itemId: number): void {
    this.cartService.removeItem(itemId).subscribe();
  }

  protected goToCheckout(): void {
    this.router.navigateByUrl("/shop/checkout");
  }

  protected imageFor(item: CartItem): string {
    return this.imageService.resolveFirst(
      item.imageUrl ? [item.imageUrl] : [],
      "https://placehold.co/80x80/e8e8e8/999999?text=No+Image",
    );
  }
}
