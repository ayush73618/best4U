import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Page, Product } from '../../../core/models/shop.model';
import { DecimalPipe } from '@angular/common';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [RouterLink,DecimalPipe],
  templateUrl: './my-listings.html',
  styleUrl: './my-listings.scss',
})
export class MyListings implements OnInit {
  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(true);

  // add to constructor/inject:
private readonly imageService = inject(ImageService);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<ApiResponse<Page<Product>>>(`${environment.apiBaseUrl}/products/mine`).subscribe((res) => {
      this.products.set(res.data.content);
      this.loading.set(false);
    });
  }

  protected imageFor(product: Product): string {
  return this.imageService.resolveFirst(
    product.imageUrls,
    'https://placehold.co/400x400/e8e8e8/999999?text=No+Image'
  );
}
}