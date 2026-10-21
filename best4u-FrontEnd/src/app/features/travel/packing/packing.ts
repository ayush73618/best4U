import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

interface PackingItem {
  id: number;
  text: string;
  packed: boolean;
}

@Component({
  selector: 'app-packing',
  standalone: true,
  templateUrl: './packing.html',
  styleUrl: './packing.scss',
})
export class Packing implements OnInit {
  private tripId = 0;
  private baseUrl = '';

  protected readonly items = signal<PackingItem[]>([]);
  protected readonly loading = signal(true);
  protected readonly newItemText = signal('');

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.tripId = Number(this.route.parent?.snapshot.paramMap.get('tripId'));
    this.baseUrl = `${environment.apiBaseUrl}/travel/trips/${this.tripId}/packing`;
  }

  ngOnInit(): void {
    this.http.get<ApiResponse<PackingItem[]>>(this.baseUrl).subscribe((res) => {
      this.items.set(res.data);
      this.loading.set(false);
    });
  }

  protected onNewItemInput(value: string): void { this.newItemText.set(value); }

  protected addItem(): void {
    const text = this.newItemText().trim();
    if (!text) return;

    this.http.post<ApiResponse<PackingItem>>(this.baseUrl, { text }).subscribe((res) => {
      this.items.update((list) => [...list, res.data]);
      this.newItemText.set('');
    });
  }

  protected toggleItem(id: number): void {
    this.http.put<ApiResponse<PackingItem>>(`${this.baseUrl}/${id}/toggle`, {}).subscribe((res) => {
      this.items.update((list) => list.map((i) => (i.id === id ? res.data : i)));
    });
  }

  protected deleteItem(id: number): void {
    this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).subscribe(() => {
      this.items.update((list) => list.filter((i) => i.id !== id));
    });
  }

  protected get packedCount(): number {
    return this.items().filter((i) => i.packed).length;
  }
}