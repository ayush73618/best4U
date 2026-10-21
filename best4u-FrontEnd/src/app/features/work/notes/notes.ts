import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

interface Note {
  id: number;
  title: string;
  body: string;
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

  // Same pattern as Trip Notes: editing state is purely local until Save
  // is clicked. isNewDraft distinguishes "new, not-yet-saved note" from
  // "editing an existing one", since a new draft has no id yet.
  protected readonly editingId = signal<number | null>(null);
  protected readonly isNewDraft = signal(false);
  protected readonly draftTitle = signal('');
  protected readonly draftBody = signal('');
  protected readonly errorMessage = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<ApiResponse<Note[]>>(this.baseUrl).subscribe((res) => {
      this.notes.set(res.data);
      this.loading.set(false);
    });
  }

  // No API call - opening a new note is purely local state.
  protected newNote(): void {
    this.isNewDraft.set(true);
    this.editingId.set(null);
    this.draftTitle.set('');
    this.draftBody.set('');
    this.errorMessage.set(null);
  }

  protected openNote(id: number): void {
    const note = this.notes().find((n) => n.id === id);
    if (!note) return;
    this.isNewDraft.set(false);
    this.editingId.set(id);
    this.draftTitle.set(note.title);
    this.draftBody.set(note.body);
    this.errorMessage.set(null);
  }

  protected onTitleInput(value: string): void { this.draftTitle.set(value); }
  protected onBodyInput(value: string): void { this.draftBody.set(value); }

  protected saveNote(): void {
    if (!this.draftTitle().trim() && !this.draftBody().trim()) {
      this.errorMessage.set('A note needs a title or some content.');
      return;
    }

    const payload = { title: this.draftTitle(), body: this.draftBody() };

    if (this.isNewDraft()) {
      this.http.post<ApiResponse<Note>>(this.baseUrl, payload).subscribe({
        next: (res) => {
          this.notes.update((list) => [res.data, ...list]);
          this.closeEditor();
        },
        error: (err) => this.errorMessage.set(err.message),
      });
    } else {
      const id = this.editingId();
      if (id === null) return;
      this.http.put<ApiResponse<Note>>(`${this.baseUrl}/${id}`, payload).subscribe({
        next: (res) => {
          this.notes.update((list) => [res.data, ...list.filter((n) => n.id !== id)]);
          this.closeEditor();
        },
        error: (err) => this.errorMessage.set(err.message),
      });
    }
  }

  // No API call, period - a never-saved draft has nothing to clean up.
  protected cancelEdit(): void {
    this.closeEditor();
  }

  protected deleteNote(id: number): void {
    this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).subscribe(() => {
      this.notes.update((list) => list.filter((n) => n.id !== id));
    });
  }

  protected snippet(note: Note): string {
    return note.body.length > 80 ? note.body.slice(0, 80) + '…' : note.body || 'No content';
  }

  private closeEditor(): void {
    this.editingId.set(null);
    this.isNewDraft.set(false);
    this.errorMessage.set(null);
  }
}
