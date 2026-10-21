import { Component, signal } from '@angular/core';
import { CopyButton } from '../../../shared/components/copy-button/copy-button';

@Component({
  selector: 'app-timestamp-converter',
  standalone: true,
  imports: [CopyButton],
  templateUrl: './timestamp-converter.html',
  styleUrl: './timestamp-converter.scss',
})
export class TimestampConverter {
  protected readonly epochInput = signal('');
  protected readonly dateInput = signal('');
  protected readonly epochError = signal<string | null>(null);
  protected readonly dateError = signal<string | null>(null);
  protected readonly localResult = signal('');
  protected readonly utcResult = signal('');
  protected readonly epochResult = signal('');

  protected useNow(): void {
    this.epochInput.set(Math.floor(Date.now() / 1000).toString());
    this.convertFromEpoch();
  }

  protected onEpochInput(value: string): void { this.epochInput.set(value); }

  protected convertFromEpoch(): void {
    const raw = this.epochInput().trim();
    if (!raw) { this.epochError.set(null); this.localResult.set(''); return; }

    const num = Number(raw);
    if (!Number.isFinite(num)) {
      this.epochError.set('Enter a valid number of seconds since 1970-01-01.');
      return;
    }
    // A 13-digit number is almost certainly already milliseconds, not
    // seconds implying a date thousands of years in the future.
    const ms = raw.length >= 13 ? num : num * 1000;
    const date = new Date(ms);
    if (isNaN(date.getTime())) {
      this.epochError.set('That doesn\u2019t convert to a valid date.');
      return;
    }
    this.epochError.set(null);
    this.localResult.set(date.toLocaleString());
    this.utcResult.set(date.toUTCString());
  }

  protected onDateInput(value: string): void { this.dateInput.set(value); }

  protected convertFromDate(): void {
    const raw = this.dateInput();
    if (!raw) { this.dateError.set(null); this.epochResult.set(''); return; }

    const date = new Date(raw);
    if (isNaN(date.getTime())) {
      this.dateError.set('Enter a valid date/time.');
      return;
    }
    this.dateError.set(null);
    this.epochResult.set(Math.floor(date.getTime() / 1000).toString());
  }
}