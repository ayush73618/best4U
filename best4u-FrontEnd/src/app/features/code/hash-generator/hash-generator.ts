import { Component, signal } from '@angular/core';
import md5 from 'blueimp-md5';
import { CopyButton } from '../../../shared/components/copy-button/copy-button';

interface HashResults {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
}

@Component({
  selector: 'app-hash-generator',
  standalone: true,
  imports: [CopyButton],
  templateUrl: './hash-generator.html',
  styleUrl: './hash-generator.scss',
})
export class HashGenerator {
  protected readonly input = signal('');
  protected readonly hashes = signal<HashResults | null>(null);

  // crypto.subtle requires a secure context (https, or localhost for dev)
  // - it silently isn't available otherwise.
  protected async onInput(value: string): Promise<void> {
    this.input.set(value);
    if (!value) {
      this.hashes.set(null);
      return;
    }

    const [sha1, sha256, sha512] = await Promise.all([
      this.digest('SHA-1', value),
      this.digest('SHA-256', value),
      this.digest('SHA-512', value),
    ]);

    this.hashes.set({ md5: md5(value), sha1, sha256, sha512 });
  }

  private async digest(algorithm: string, text: string): Promise<string> {
    const data = new TextEncoder().encode(text);
    const buffer = await crypto.subtle.digest(algorithm, data);
    return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}