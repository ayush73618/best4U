import { Component, computed, signal } from '@angular/core';
import { CopyButton } from '../../../shared/components/copy-button/copy-button';

@Component({
  selector: 'app-url-encoder',
  standalone: true,
  imports: [CopyButton],
  templateUrl: './url-encoder.html',
  styleUrl: './url-encoder.scss',
})
export class UrlEncoder {
  protected readonly input = signal('');
  protected readonly mode = signal<'encode' | 'decode'>('encode');

  protected readonly result = computed<{ output: string; error: string | null }>(() => {
    const raw = this.input();
    if (!raw) return { output: '', error: null };
    try {
      return { output: this.mode() === 'encode' ? encodeURIComponent(raw) : decodeURIComponent(raw), error: null };
    } catch {
      return { output: '', error: 'That doesn\u2019t look like valid URL-encoded text.' };
    }
  });

  protected onInput(value: string): void { this.input.set(value); }
  protected setMode(mode: 'encode' | 'decode'): void { this.mode.set(mode); this.input.set(''); }
}