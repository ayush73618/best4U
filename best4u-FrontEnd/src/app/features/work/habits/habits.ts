import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

interface Habit {
  id: number;
  name: string;
  completedDates: string[];
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'app-habits',
  standalone: true,
  templateUrl: './habits.html',
  styleUrl: './habits.scss',
})
export class Habits implements OnInit {
  private readonly baseUrl = `${environment.apiBaseUrl}/work/habits`;

  protected readonly habits = signal<Habit[]>([]);
  protected readonly loading = signal(true);
  protected readonly newHabitName = signal('');
  protected readonly today = todayKey();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<ApiResponse<Habit[]>>(this.baseUrl).subscribe((res) => {
      this.habits.set(res.data);
      this.loading.set(false);
    });
  }

  protected onNewHabitInput(value: string): void {
    this.newHabitName.set(value);
  }

  protected addHabit(): void {
    const name = this.newHabitName().trim();
    if (!name) return;

    this.http.post<ApiResponse<Habit>>(this.baseUrl, { name }).subscribe((res) => {
      this.habits.update((list) => [res.data, ...list]);
      this.newHabitName.set('');
    });
  }

  protected isDoneToday(habit: Habit): boolean {
    return habit.completedDates.includes(this.today);
  }

  protected toggleToday(id: number): void {
    this.http.put<ApiResponse<Habit>>(`${this.baseUrl}/${id}/toggle-today`, {}).subscribe((res) => {
      this.habits.update((list) => list.map((h) => (h.id === id ? res.data : h)));
    });
  }

  protected deleteHabit(id: number): void {
    this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).subscribe(() => {
      this.habits.update((list) => list.filter((h) => h.id !== id));
    });
  }

  // Consecutive days ending today or yesterday — same logic as before,
  // just now walking the completedDates array the backend returned.
  protected currentStreak(habit: Habit): number {
    const dates = new Set(habit.completedDates);
    let streak = 0;
    const cursor = new Date();

    if (!dates.has(this.today)) {
      cursor.setDate(cursor.getDate() - 1);
    }

    while (dates.has(cursor.toISOString().slice(0, 10))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }
}