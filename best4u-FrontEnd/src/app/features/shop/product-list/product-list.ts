import { DecimalPipe } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { ApiResponse } from "../../../core/models/api-response.model";
import { Page, Product } from "../../../core/models/shop.model";
import { ImageService } from "../../../core/services/image.service";
import { EmptyState } from "../../../shared/components/empty-state/empty-state";
import { Skeleton } from "../../../shared/components/skeleton/skeleton";

@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [RouterLink, DecimalPipe, EmptyState, Skeleton],
  templateUrl: "./product-list.html",
  styleUrl: "./product-list.scss",
})
export class ProductList implements OnInit {
  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(true);
  // add to constructor/inject:
  private readonly imageService = inject(ImageService);

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const categoryId = params.get("categoryId");
      const search = params.get("search");
      this.loading.set(true);

      let url = `${environment.apiBaseUrl}/products?size=40`;
      if (categoryId) url += `&categoryId=${categoryId}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      this.http.get<ApiResponse<Page<Product>>>(url).subscribe((res) => {
        this.products.set(res.data.content);
        this.loading.set(false);
      });
    });
  }

  protected imageFor(product: Product): string {
    return this.imageService.resolveFirst(
      product.imageUrls,
      "https://placehold.co/400x400/e8e8e8/999999?text=No+Image",
    );
  }

  protected readonly searchActive = computed(
    () => !!this.route.snapshot.queryParamMap.get("search"),
  );

  protected starsFor(rating: number): string {
    return "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
  }
}
