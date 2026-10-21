import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

interface BudgetItem {
  id: number;
  category: string;
  description: string | null;
  amount: number;
}

@Component({
  selector: 'app-budget',
  standalone: true,
  templateUrl: './budget.html',
  styleUrl: './budget.scss',
})
export class Budget implements OnInit {
  private tripId = 0;
  private baseUrl = '';

  protected readonly items = signal<BudgetItem[]>([]);
  protected readonly loading = signal(true);

  protected readonly category = signal('');
  protected readonly description = signal('');
  protected readonly amount = signal('');

  protected readonly total = computed(() => this.items().reduce((sum, i) => sum + i.amount, 0));

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.tripId = Number(this.route.parent?.snapshot.paramMap.get('tripId'));
    this.baseUrl = `${environment.apiBaseUrl}/travel/trips/${this.tripId}/budget`;
  }

  ngOnInit(): void {
    this.http.get<ApiResponse<BudgetItem[]>>(this.baseUrl).subscribe((res) => {
      this.items.set(res.data);
      this.loading.set(false);
    });
  }

  protected onCategoryInput(v: string) { this.category.set(v); }
  protected onDescriptionInput(v: string) { this.description.set(v); }
  protected onAmountInput(v: string) { this.amount.set(v); }

  protected addItem(): void {
    const amountNum = Number(this.amount());
    if (!this.category().trim() || !Number.isFinite(amountNum) || amountNum <= 0) return;

    const payload = { category: this.category(), description: this.description() || null, amount: amountNum };

    this.http.post<ApiResponse<BudgetItem>>(this.baseUrl, payload).subscribe((res) => {
      this.items.update((list) => [res.data, ...list]);
      this.category.set('');
      this.description.set('');
      this.amount.set('');
    });
  }

  protected deleteItem(id: number): void {
    this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).subscribe(() => {
      this.items.update((list) => list.filter((i) => i.id !== id));
    });
  }

  // NOTE: hardcoded to USD - the trip's own `currency` field (set when
  // the trip was created) isn't fetched here, since that would mean this
  // component also loading the parent Trip record. Wire that in once you
  // want budget amounts to actually show in the trip's real currency.
  protected formatAmount(value: number): string {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value);
  }
}