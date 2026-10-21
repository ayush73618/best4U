import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Category } from '../../../core/models/shop.model';
import { FileDropzone } from '../../../shared/components/file-dropzone/file-dropzone';

@Component({
  selector: 'app-sell-product',
  standalone: true,
  imports: [FileDropzone],
  templateUrl: './sell-product.html',
  styleUrl: './sell-product.scss',
})
export class SellProduct implements OnInit {
  protected readonly categories = signal<Category[]>([]);
  protected readonly images = signal<File[]>([]);
  protected readonly imagePreviews = signal<string[]>([]);

  protected readonly name = signal('');
  protected readonly description = signal('');
  protected readonly price = signal('');
  protected readonly stockQuantity = signal('');
  protected readonly categoryId = signal('');

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<ApiResponse<Category[]>>(`${environment.apiBaseUrl}/categories`).subscribe((res) => {
      this.categories.set(res.data);
    });
  }

  protected onNameInput(v: string) { this.name.set(v); }
  protected onDescriptionInput(v: string) { this.description.set(v); }
  protected onPriceInput(v: string) { this.price.set(v); }
  protected onStockInput(v: string) { this.stockQuantity.set(v); }
  protected onCategoryChange(v: string) { this.categoryId.set(v); }

    protected onImagesSelected(files: File[]): void {
    const combined = [...this.images(), ...files];
    this.images.set(combined);
    this.imagePreviews.set(combined.map((f) => URL.createObjectURL(f)));
  }

  protected removeImage(index: number): void {
    const updated = this.images().filter((_, i) => i !== index);
    this.images.set(updated);
    this.imagePreviews.set(updated.map((f) => URL.createObjectURL(f)));
  }

  protected submit(): void {
    const priceNum = Number(this.price());
    const stockNum = Number(this.stockQuantity());

    if (!this.name().trim()) { this.errorMessage.set('Product name is required.'); return; }
    if (!Number.isFinite(priceNum) || priceNum <= 0) { this.errorMessage.set('Enter a valid price.'); return; }
    if (!Number.isFinite(stockNum) || stockNum < 0) { this.errorMessage.set('Enter a valid stock quantity.'); return; }
    if (!this.categoryId()) { this.errorMessage.set('Select a category.'); return; }
    if (this.images().length === 0) { this.errorMessage.set('Add at least one product image.'); return; }

    const productPayload = {
      name: this.name(),
      description: this.description(),
      price: priceNum,
      categoryId: Number(this.categoryId()),
      stockQuantity: stockNum,
    };

    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(productPayload)], { type: 'application/json' }));
    this.images().forEach((file) => formData.append('images', file));

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.http.post<ApiResponse<unknown>>(`${environment.apiBaseUrl}/products`, formData).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitted.set(true);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }

  protected goToMyListings(): void {
    this.router.navigateByUrl('/shop/my-listings');
  }
}