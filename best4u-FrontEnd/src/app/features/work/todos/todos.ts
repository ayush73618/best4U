import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

@Component({
  selector: 'app-todos',
  standalone: true,
  templateUrl: './todos.html',
  styleUrl: './todos.scss',
})
export class Todos implements OnInit {
  private readonly baseUrl = `${environment.apiBaseUrl}/work/todos`;

  protected readonly todos = signal<Todo[]>([]);
  protected readonly newTodoText = signal('');
  protected readonly loading = signal(true);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<ApiResponse<Todo[]>>(this.baseUrl).subscribe((res) => {
      this.todos.set(res.data);
      this.loading.set(false);
    });
  }

  protected onNewTodoInput(value: string): void {
    this.newTodoText.set(value);
  }

  protected addTodo(): void {
    const text = this.newTodoText().trim();
    if (!text) return;

    this.http.post<ApiResponse<Todo>>(this.baseUrl, { text }).subscribe((res) => {
      this.todos.update((list) => [res.data, ...list]);
      this.newTodoText.set('');
    });
  }

  protected toggleTodo(id: number): void {
    this.http.put<ApiResponse<Todo>>(`${this.baseUrl}/${id}/toggle`, {}).subscribe((res) => {
      this.todos.update((list) => list.map((t) => (t.id === id ? res.data : t)));
    });
  }

  protected deleteTodo(id: number): void {
    this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).subscribe(() => {
      this.todos.update((list) => list.filter((t) => t.id !== id));
    });
  }

  protected clearCompleted(): void {
    const completed = this.todos().filter((t) => t.done);
    completed.forEach((t) => this.deleteTodo(t.id));
  }

  protected get pendingCount(): number {
    return this.todos().filter((t) => !t.done).length;
  }

  protected get completedCount(): number {
    return this.todos().filter((t) => t.done).length;
  }
}