import {
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject, debounceTime, distinctUntilChanged } from "rxjs";
import { DecimalPipe } from "@angular/common";
import { environment } from "../../../../environments/environment";
import { ApiResponse } from "../../../core/models/api-response.model";
import { Page, Product } from "../../../core/models/shop.model";
import { ImageService } from "../../../core/services/image.service";
import { FADE_IN } from "../../../animations";

@Component({
  selector: "app-search-bar",
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: "./search-bar.html",
  styleUrl: "./search-bar.scss",
  animations: [FADE_IN],
})
export class SearchBar {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);
  private readonly imageService = inject(ImageService);

  protected readonly query = signal("");
  protected readonly results = signal<Product[]>([]);
  protected readonly showResults = signal(false);
  protected readonly loading = signal(false);
  protected readonly noResults = signal(false);

  private readonly queryChanges = new Subject<string>();

  constructor() {
    this.queryChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((q) => this.search(q));
  }

  protected onInput(value: string): void {
    this.query.set(value);
    const hasInput = value.trim().length > 0;
    this.showResults.set(hasInput);
    this.noResults.set(false);
    if (hasInput) {
      this.loading.set(true);
    } else {
      this.loading.set(false);
      this.results.set([]);
    }
    this.queryChanges.next(value);
  }

  private search(q: string): void {
    if (!q.trim()) {
      this.results.set([]);
      this.loading.set(false);
      return;
    }
    this.http
      .get<
        ApiResponse<Page<Product>>
      >(`${environment.apiBaseUrl}/products?search=${encodeURIComponent(q)}&size=6`)
      .subscribe({
        next: (res) => {
          this.results.set(res.data.content);
          this.noResults.set(res.data.content.length === 0);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.noResults.set(true);
        },
      });
  }

  protected imageFor(product: Product): string {
    return this.imageService.resolveFirst(
      product.imageUrls,
      "https://placehold.co/40x40/e8e8e8/999999?text=%20",
    );
  }

  protected goToProduct(id: number): void {
    this.showResults.set(false);
    this.query.set("");
    this.router.navigate(["/shop/products", id]);
  }

  protected seeAllResults(): void {
    const q = this.query();
    this.showResults.set(false);
    this.query.set("");
    this.router.navigate(["/shop"], { queryParams: { search: q } });
  }

  protected clear(): void {
    this.query.set("");
    this.results.set([]);
    this.showResults.set(false);
    this.loading.set(false);
    this.noResults.set(false);
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showResults.set(false);
    }
  }
}
