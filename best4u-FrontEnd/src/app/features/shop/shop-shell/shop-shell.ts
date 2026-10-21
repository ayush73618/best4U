import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Category } from '../../../core/models/shop.model';
import { UmbrellaSwitcher } from '../../../shared/components/umbrella-switcher/umbrella-switcher';

@Component({
  selector: 'app-shop-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, UmbrellaSwitcher],
  templateUrl: './shop-shell.html',
  styleUrl: './shop-shell.scss',
})
export class ShopShell implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  protected readonly categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.http.get<ApiResponse<Category[]>>(`${environment.apiBaseUrl}/categories`).subscribe((res) => {
      this.categories.set(res.data);
    });
  }

  protected selectCategory(categoryId: number | null): void {
    this.router.navigate(['/shop'], { queryParams: categoryId ? { categoryId } : {} });
  }
}