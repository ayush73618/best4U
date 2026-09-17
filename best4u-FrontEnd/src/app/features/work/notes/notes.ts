import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

interface Note {
  id: number;
  title: string;
  body: string;
  updatedAt: string;
}

@Component({
  selector: 'app-notes',
  standalone: true,
  templateUrl: './notes.html',
  styleUrl: './notes.scss',
})
export class Notes implements OnInit {
  private readonly baseUrl = `${environment.apiBaseUrl}/work/notes`;

  protected readonly notes = signal<Note[]>([]);
  protected readonly loading = signal(true);
  protected readonly editingId = signal<number | null>(null);
  protected readonly draftTitle = signal('');
  protected readonly draftBody = signal('');

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<ApiResponse<Note[]>>(this.baseUrl).subscribe((res) => {
      this.notes.set(res.data);
      this.loading.set(false);
    });
  }

  protected newNote(): void {
    this.http.post<ApiResponse<Note>>(this.baseUrl, {}).subscribe((res) => {
      this.notes.update((list) => [res.data, ...list]);
      this.openNote(res.data.id);
    });
  }

  protected openNote(id: number): void {
    const note = this.notes().find((n) => n.id === id);
    if (!note) return;
    this.editingId.set(id);
    this.draftTitle.set(note.title);
    this.draftBody.set(note.body);
  }

  protected onTitleInput(value: string): void {
    this.draftTitle.set(value);
  }

  protected onBodyInput(value: string): void {
    this.draftBody.set(value);
  }

  protected saveNote(): void {
    const id = this.editingId();
    if (id === null) return;

    this.http
      .put<ApiResponse<Note>>(`${this.baseUrl}/${id}`, { title: this.draftTitle(), body: this.draftBody() })
      .subscribe((res) => {
        // Move the just-saved note to the top locally instead of refetching
        // the whole list — matches the backend's "most recently updated
        // first" ordering without an extra round trip.
        this.notes.update((list) => [res.data, ...list.filter((n) => n.id !== id)]);
        this.editingId.set(null);
      });
  }

  protected cancelEdit(): void {
    const id = this.editingId();
    const note = this.notes().find((n) => n.id === id);
    // Discard blank notes created but never filled in — avoids a graveyard
    // of empty "Untitled" entries from accidental taps on "+ New note".
    if (note && !note.title && !note.body) {
      this.deleteNote(note.id, false);
    }
    this.editingId.set(null);
  }

  protected deleteNote(id: number, confirmFirst = true): void {
    this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).subscribe(() => {
      this.notes.update((list) => list.filter((n) => n.id !== id));
    });
  }

  protected snippet(note: Note): string {
    return note.body.length > 80 ? note.body.slice(0, 80) + '…' : note.body || 'No content';
  }
}