import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

interface TripNote {
  id: number;
  title: string;
  body: string;
}

@Component({
  selector: 'app-trip-notes',
  standalone: true,
  templateUrl: './trip-notes.html',
  styleUrl: './trip-notes.scss',
})
export class TripNotes implements OnInit {
  private readonly tripId:Number =0;
  private readonly baseUrl:string ='';

  protected readonly notes = signal<TripNote[]>([]);
  protected readonly loading = signal(true);

  // Editing state is now purely local until Save is clicked. `editingId`
  // is null for "not editing" AND for "editing a brand-new, not-yet-saved
  // draft" - `isNewDraft` distinguishes the two, since a new draft has no
  // real id yet to key off of.
  protected readonly editingId = signal<number | null>(null);
  protected readonly isNewDraft = signal(false);
  protected readonly draftTitle = signal('');
  protected readonly draftBody = signal('');
  protected readonly errorMessage = signal<string | null>(null);

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.tripId  = Number(this.route.parent?.snapshot.paramMap.get('tripId'));
    this.baseUrl = `${environment.apiBaseUrl}/travel/trips/${this.tripId}/notes`;
  }

  ngOnInit(): void {
    this.http.get<ApiResponse<TripNote[]>>(this.baseUrl).subscribe((res) => {
      this.notes.set(res.data);
      this.loading.set(false);
    });
  }

  // No API call here anymore - opening a new note is purely local state
  // until the user actually decides to keep it.
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
      // ONE call, with the real content already attached - replaces the
      // old "create blank, then PUT to fill it in" two-call flow.
      this.http.post<ApiResponse<TripNote>>(this.baseUrl, payload).subscribe({
        next: (res) => {
          this.notes.update((list) => [res.data, ...list]);
          this.closeEditor();
        },
        error: (err) => this.errorMessage.set(err.message),
      });
    } else {
      const id = this.editingId();
      if (id === null) return;
      this.http.put<ApiResponse<TripNote>>(`${this.baseUrl}/${id}`, payload).subscribe({
        next: (res) => {
          this.notes.update((list) => [res.data, ...list.filter((n) => n.id !== id)]);
          this.closeEditor();
        },
        error: (err) => this.errorMessage.set(err.message),
      });
    }
  }

  // No API call, period. A never-saved draft was never created
  // server-side, so there's nothing to clean up - and an edit to an
  // existing note simply discards local changes, leaving the saved
  // version on the server untouched.
  protected cancelEdit(): void {
    this.closeEditor();
  }

  protected deleteNote(id: number): void {
    this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).subscribe(() => {
      this.notes.update((list) => list.filter((n) => n.id !== id));
    });
  }

  protected snippet(note: TripNote): string {
    return note.body.length > 80 ? note.body.slice(0, 80) + '…' : note.body || 'No content';
  }

  private closeEditor(): void {
    this.editingId.set(null);
    this.isNewDraft.set(false);
    this.errorMessage.set(null);
  }
}
