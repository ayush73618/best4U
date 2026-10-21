import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

interface ItineraryItem {
  id: number;
  day: number;
  time: string | null;
  title: string;
  notes: string | null;
}

@Component({
  selector: 'app-itinerary',
  standalone: true,
  templateUrl: './itinerary.html',
  styleUrl: './itinerary.scss',
})
export class Itinerary implements OnInit {
  // tripId lives on the PARENT route (:tripId, matched by TripShell), not
  // this component's own route segment - read via route.parent.
  private tripId = 0;
  private baseUrl = '';

  protected readonly items = signal<ItineraryItem[]>([]);
  protected readonly loading = signal(true);

  protected readonly day = signal(1);
  protected readonly time = signal('');
  protected readonly title = signal('');
  protected readonly notes = signal('');

  protected readonly groupedByDay = computed(() => {
    const groups = new Map<number, ItineraryItem[]>();
    for (const item of this.items()) {
      if (!groups.has(item.day)) groups.set(item.day, []);
      groups.get(item.day)!.push(item);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a - b);
  });

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.tripId = Number(this.route.parent?.snapshot.paramMap.get('tripId'));
    this.baseUrl = `${environment.apiBaseUrl}/travel/trips/${this.tripId}/itinerary`;
  }

  ngOnInit(): void {
    this.http.get<ApiResponse<ItineraryItem[]>>(this.baseUrl).subscribe((res) => {
      this.items.set(res.data);
      this.loading.set(false);
    });
  }

  protected onDayInput(v: string) { this.day.set(Number(v) || 1); }
  protected onTimeInput(v: string) { this.time.set(v); }
  protected onTitleInput(v: string) { this.title.set(v); }
  protected onNotesInput(v: string) { this.notes.set(v); }

  protected addItem(): void {
    if (!this.title().trim()) return;

    const payload = { day: this.day(), time: this.time() || null, title: this.title(), notes: this.notes() || null };

    this.http.post<ApiResponse<ItineraryItem>>(this.baseUrl, payload).subscribe((res) => {
      this.items.update((list) => [...list, res.data]);
      this.time.set('');
      this.title.set('');
      this.notes.set('');
    });
  }

  protected deleteItem(id: number): void {
    this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).subscribe(() => {
      this.items.update((list) => list.filter((i) => i.id !== id));
    });
  }
}