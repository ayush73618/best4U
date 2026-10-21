import { Component, computed, signal } from '@angular/core';
import { CopyButton } from '../../../shared/components/copy-button/copy-button';

@Component({
  selector: 'app-base64-tool',
  standalone: true,
  imports: [CopyButton],
  templateUrl: './base64-tool.html',
  styleUrl: './base64-tool.scss',
})
export class Base64Tool {
  protected readonly input = signal('');
  protected readonly mode = signal<'encode' | 'decode'>('encode');

  protected readonly result = computed<{ output: string; error: string | null }>(() => {
    const raw = this.input();
    if (!raw) return { output: '', error: null };
    try {
      return this.mode() === 'encode'
        ? { output: this.toBase64(raw), error: null }
        : { output: this.fromBase64(raw), error: null };
    } catch {
      return { output: '', error: this.mode() === 'decode' ? 'That doesn\u2019t look like valid base64.' : 'Could not encode this text.' };
    }
  });

  protected onInput(value: string): void { this.input.set(value); }
  protected setMode(mode: 'encode' | 'decode'): void { this.mode.set(mode); this.input.set(''); }

  private toBase64(str: string): string {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
  }

  private fromBase64(b64: string): string {
    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
}