import { Component, computed, signal } from '@angular/core';
import { CopyButton } from '../../../shared/components/copy-button/copy-button';

interface DecodedJwt {
  header: string;
  payload: string;
  expiresAt: string | null;
  error: string | null;
}

@Component({
  selector: 'app-jwt-decoder',
  standalone: true,
  imports: [CopyButton],
  templateUrl: './jwt-decoder.html',
  styleUrl: './jwt-decoder.scss',
})
export class JwtDecoder {
  protected readonly token = signal('');

  protected readonly decoded = computed<DecodedJwt | null>(() => {
    const raw = this.token().trim();
    if (!raw) return null;

    const parts = raw.split('.');
    if (parts.length !== 3) {
      return { header: '', payload: '', expiresAt: null, error: 'A JWT should have three parts separated by dots (header.payload.signature).' };
    }

    try {
      const header = JSON.stringify(JSON.parse(this.base64UrlDecode(parts[0])), null, 2);
      const payloadObj = JSON.parse(this.base64UrlDecode(parts[1]));
      const payload = JSON.stringify(payloadObj, null, 2);
      const expiresAt = typeof payloadObj.exp === 'number' ? new Date(payloadObj.exp * 1000).toLocaleString() : null;
      return { header, payload, expiresAt, error: null };
    } catch {
      return { header: '', payload: '', expiresAt: null, error: 'Could not decode this token — check that it\u2019s valid base64url-encoded JSON.' };
    }
  });

  protected onTokenInput(value: string): void {
    this.token.set(value);
  }

  // JWTs use base64url (- and _ instead of + and /, no padding), not
  // plain base64 - atob() needs the alphabet translated first.
  private base64UrlDecode(input: string): string {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return decodeURIComponent(
      atob(padded).split('').map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    );
  }
}