import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { filter } from "rxjs";
import { AuthService } from "../../core/auth/auth.service";
import { AuthModalService } from "../../core/auth/auth-modal.service";
import { CartService } from "../../core/services/cart.service";
import { SearchBar } from "../../shared/components/search-bar/search-bar";
import { AccountMenu } from "../../shared/components/account-menu/account-menu";
import { CartBadge } from "../../shared/components/cart-badge/cart-badge";
import { NotificationBell } from "../../shared/components/notification-bell/notification-bell";

const UTILITIES_PREFIXES = ["/tools", "/money", "/work", "/docs", "/code"];

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink, SearchBar, AccountMenu, CartBadge, NotificationBell],
  templateUrl: "./header.html",
  styleUrl: "./header.scss",
})
export class Header implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly authModalService = inject(AuthModalService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  private readonly currentUrl = signal<string>(this.router.url);

  // A product search box has no business sitting above a calculator or
  // a to-do list - hidden whenever the active route is a Utilities
  // section, present everywhere else (Home, Shop, Travel).
  protected readonly showSearch = computed<boolean>(
    () =>
      !UTILITIES_PREFIXES.some((prefix) =>
        this.currentUrl().startsWith(prefix),
      ),
  );

  constructor() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
      )
      .subscribe(() => {
        this.currentUrl.set(this.router.url);
      });
  }

  ngOnInit(): void {
    // Loaded once here, globally, so the cart badge is correct even
    // before the user ever visits /shop.
    this.cartService.loadCart();
  }

  protected openSignIn(): void {
    this.authModalService.open("login");
  }
}
