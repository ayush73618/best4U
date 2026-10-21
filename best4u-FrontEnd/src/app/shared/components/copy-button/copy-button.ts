import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-copy-button',
  standalone: true,
  templateUrl: './copy-button.html',
  styleUrl: './copy-button.scss',
})
export class CopyButton {
  @Input({ required: true }) text!: string;

  protected readonly copied = signal(false);

  protected async copy(): Promise<void> {
    if (!this.text) return;
    try {
      await navigator.clipboard.writeText(this.text);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    } catch {
      // Clipboard API blocked (e.g. insecure context) - the text is still
      // selectable/copyable manually from the output box either way.
    }
  }
}