import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { ApiResponse } from "../../../core/models/api-response.model";
import { AuthService } from "../../../core/auth/auth.service";
import { AuthModalService } from "../../../core/auth/auth-modal.service";
import { ImageService } from "../../../core/services/image.service";
import { CartService } from "../../../core/services/cart.service";
import { ToastService } from "../../../core/services/toast.service";
import { Page, Product } from "../../../core/models/shop.model";
import { Skeleton } from "../../../shared/components/skeleton/skeleton";

const FALLBACK = "https://placehold.co/600x600/f4f6f5/9ab0ac?text=No+Image";

@Component({
  selector: "app-product-detail",
  standalone: true,
  imports: [DecimalPipe, RouterLink, Skeleton],
  templateUrl: "./product-detail.html",
  styleUrl: "./product-detail.scss",
})
export class ProductDetail implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly authModalService = inject(AuthModalService);
  private readonly imageService = inject(ImageService);
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);

  protected readonly product = signal<Product | null>(null);
  protected readonly loading = signal(true);
  protected readonly quantity = signal(1);
  protected readonly adding = signal(false);
  protected readonly emiOpen = signal(false);
  protected readonly rating = signal<{
    averageRating: number;
    reviewCount: number;
    canReview: boolean;
  } | null>(null);
  protected readonly reviews = signal<
    {
      id: number;
      rating: number;
      comment: string | null;
      reviewerName: string;
      createdAt: string;
    }[]
  >([]);
  protected readonly reviewsLoading = signal(false);
  protected readonly reviewRating = signal(5);
  protected readonly reviewComment = signal("");
  protected readonly submittingReview = signal(false);

  // Gallery
  protected readonly galleryImages = signal<string[]>([]);
  protected readonly activeIndex = signal(0);
  protected readonly activeImage = computed(
    () => this.galleryImages()[this.activeIndex()] ?? FALLBACK,
  );

  // EMI options at 12% p.a. — same formula as BM4U's EMI calculator
  protected readonly emiOptions = computed(() => {
    const price = this.product()?.price;
    if (!price || price < 1000) return [];
    const rate = 0.12 / 12;
    return [3, 6, 9, 12].map((months) => {
      const emi =
        (price * rate * Math.pow(1 + rate, months)) /
        (Math.pow(1 + rate, months) - 1);
      return { months, emi: Math.round(emi) };
    });
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    this.http
      .get<ApiResponse<Product>>(`${environment.apiBaseUrl}/products/${id}`)
      .subscribe({
        next: (res) => {
          this.product.set(res.data);
          this.galleryImages.set(
            this.imageService.resolveAll(res.data.imageUrls, FALLBACK),
          );
          this.loadReviews(res.data.id);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  protected selectImage(index: number): void {
    this.activeIndex.set(index);
  }

  protected prevImage(): void {
    const total = this.galleryImages().length;
    this.activeIndex.update((i) => (i - 1 + total) % total);
  }

  protected nextImage(): void {
    const total = this.galleryImages().length;
    this.activeIndex.update((i) => (i + 1) % total);
  }

  protected onQuantityInput(value: string): void {
    const n = Number(value);
    this.quantity.set(Number.isFinite(n) && n >= 1 ? n : 1);
  }

  protected addToCart(): void {
    if (!this.authService.isAuthenticated()) {
      this.authModalService.open("login");
      return;
    }
    const product = this.product();
    if (!product) return;

    this.adding.set(true);
    this.cartService.addOrUpdateItem(product.id, this.quantity()).subscribe({
      next: () => {
        this.adding.set(false);
      },
      error: (err) => {
        this.adding.set(false);
        this.toastService.error(err.message ?? "Could not add to cart.");
      },
    });
  }

  protected get stockLabel(): string {
    const qty = this.product()?.stockQuantity ?? 0;
    if (qty === 0) return "Out of stock";
    if (qty <= 5) return `Only ${qty} left!`;
    return `${qty} in stock`;
  }

  protected get stockClass(): string {
    const qty = this.product()?.stockQuantity ?? 0;
    if (qty === 0) return "product-detail__stock--out";
    if (qty <= 5) return "product-detail__stock--low";
    return "product-detail__stock--ok";
  }

  // Load rating + reviews after product loads
  // Add to ngOnInit, after product is fetched:
  private loadReviews(productId: number): void {
    this.http
      .get<
        ApiResponse<{
          averageRating: number;
          reviewCount: number;
          canReview: boolean;
        }>
      >(`${environment.apiBaseUrl}/products/${productId}/reviews/rating`)
      .subscribe((res) => this.rating.set(res.data));

    this.reviewsLoading.set(true);
    this.http
      .get<
        ApiResponse<
          Page<{
            id: number;
            rating: number;
            comment: string | null;
            reviewerName: string;
            createdAt: string;
          }>
        >
      >(`${environment.apiBaseUrl}/products/${productId}/reviews?size=10`)
      .subscribe((res) => {
        this.reviews.set(res.data.content);
        this.reviewsLoading.set(false);
      });
  }

  protected submitReview(): void {
    const product = this.product();
    if (!product) return;
    this.submittingReview.set(true);
    this.http
      .post<
        ApiResponse<unknown>
      >(`${environment.apiBaseUrl}/products/${product.id}/reviews`, { rating: this.reviewRating(), comment: this.reviewComment() })
      .subscribe({
        next: () => {
          this.submittingReview.set(false);
          this.toastService.success("Review submitted!");
          this.loadReviews(product.id);
        },
        error: (err) => {
          this.submittingReview.set(false);
          this.toastService.error(err.message ?? "Could not submit review.");
        },
      });
  }

  protected starsFor(n: number): string {
    const rounded = Math.round(n);
    return "★".repeat(rounded) + "☆".repeat(5 - rounded);
  }
}
