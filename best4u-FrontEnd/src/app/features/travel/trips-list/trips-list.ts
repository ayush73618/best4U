import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

interface Trip {
  id: number;
  name: string;
  destination: string | null;
  startDate: string | null;
  endDate: string | null;
  currency: string;
}

@Component({
  selector: 'app-trips-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './trips-list.html',
  styleUrl: './trips-list.scss',
})
export class TripsList implements OnInit {
  private readonly baseUrl = `${environment.apiBaseUrl}/travel/trips`;

  protected readonly trips = signal<Trip[]>([]);
  protected readonly loading = signal(true);
  protected readonly showForm = signal(false);

  protected readonly name = signal('');
  protected readonly destination = signal('');
  protected readonly startDate = signal('');
  protected readonly endDate = signal('');
  protected readonly currency = signal('USD');

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<ApiResponse<Trip[]>>(this.baseUrl).subscribe((res) => {
      this.trips.set(res.data);
      this.loading.set(false);
    });
  }

  protected onNameInput(v: string) { this.name.set(v); }
  protected onDestinationInput(v: string) { this.destination.set(v); }
  protected onStartDateInput(v: string) { this.startDate.set(v); }
  protected onEndDateInput(v: string) { this.endDate.set(v); }
  protected onCurrencyInput(v: string) { this.currency.set(v); }

  protected createTrip(): void {
    if (!this.name().trim()) return;

    const payload = {
      name: this.name(),
      destination: this.destination() || null,
      startDate: this.startDate() || null,
      endDate: this.endDate() || null,
      currency: this.currency() || 'USD',
    };

    this.http.post<ApiResponse<Trip>>(this.baseUrl, payload).subscribe((res) => {
      this.showForm.set(false);
      this.name.set('');
      this.destination.set('');
      this.startDate.set('');
      this.endDate.set('');
      this.router.navigate(['/travel', res.data.id]);
    });
  }

  protected deleteTrip(id: number, event: Event): void {
    event.stopPropagation();
    this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).subscribe(() => {
      this.trips.update((list) => list.filter((t) => t.id !== id));
    });
  }

  protected openTrip(id: number): void {
    this.router.navigate(['/travel', id]);
  }
}