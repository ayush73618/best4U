import {
  Injectable,
  computed,
  inject,
  signal,
  type Signal,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../models/api-response.model";
import { AuthService } from "../auth/auth.service";
import { CartItem } from "../models/shop.model";
import { ToastService } from "./toast.service";

// Single source of truth for cart state across the whole app - ShopShell's
// badge, the Cart page, and every "Add to cart" button all read/write
// through this instead of each independently calling HttpClient with no
// way to notify each other of a change.
@Injectable({ providedIn: "root" })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly baseUrl = `${environment.apiBaseUrl}/cart`;

  readonly items = signal<CartItem[]>([]);
  readonly itemCount: Signal<number> = computed<number>(
    () => this.items().length,
  );
  readonly total: Signal<number> = computed<number>(() =>
    this.items().reduce((sum, i) => sum + i.lineTotal, 0),
  );

  loadCart(): void {
    if (!this.authService.isAuthenticated()) {
      this.items.set([]);
      return;
    }
    this.http.get<ApiResponse<CartItem[]>>(this.baseUrl).subscribe({
      next: (res) => this.items.set(res.data),
      error: () => this.items.set([]),
    });
  }

  addOrUpdateItem(productId: number, quantity: number) {
    return this.http
      .post<
        ApiResponse<CartItem>
      >(`${this.baseUrl}/items`, { productId, quantity })
      .pipe(
        tap(() => {
          this.loadCart();
          this.toastService.success("Added to cart!");
        }),
      );
  }

  removeItem(itemId: number) {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/items/${itemId}`)
      .pipe(tap(() => this.loadCart()));
  }

  clear(): void {
    this.items.set([]);
  }
}
