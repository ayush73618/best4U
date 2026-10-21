import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Page, Product } from '../../../core/models/shop.model';
import { DecimalPipe } from '@angular/common';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-product-queue',
  imports: [DecimalPipe],
  standalone: true,
  templateUrl: './product-queue.html',
  styleUrl: './product-queue.scss',
})
export class ProductQueue implements OnInit {
  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(true);

  // add to constructor/inject:
  private readonly imageService = inject(ImageService);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.http.get<ApiResponse<Page<Product>>>(`${environment.apiBaseUrl}/admin/products/pending`).subscribe((res) => {
      this.products.set(res.data.content);
      this.loading.set(false);
    });
  }

  protected approve(id: number): void {
    this.http.put<ApiResponse<void>>(`${environment.apiBaseUrl}/admin/products/${id}/approve`, {}).subscribe(() => this.load());
  }

  protected reject(id: number): void {
    this.http.put<ApiResponse<void>>(`${environment.apiBaseUrl}/admin/products/${id}/reject`, {}).subscribe(() => this.load());
  }

  // replace imageFor():
protected imageFor(product: Product): string {
  return this.imageService.resolveFirst(
    product.imageUrls,
    'https://placehold.co/56x56/e8e8e8/999999?text=%20'
  );
}
}