import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CartService } from "../../../core/services/cart.service";
import { SCALE_IN } from "../../../animations";

@Component({
  selector: "app-cart-badge",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./cart-badge.html",
  styleUrl: "./cart-badge.scss",
  animations: [SCALE_IN],
})
export class CartBadge {
  protected readonly cartService = inject(CartService);
}
