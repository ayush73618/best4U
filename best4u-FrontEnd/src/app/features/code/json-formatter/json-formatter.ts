import { Component, computed, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CopyButton } from '../../../shared/components/copy-button/copy-button';

@Component({
  selector: 'app-json-formatter',
  standalone: true,
  imports: [CopyButton, MatFormFieldModule, MatSelectModule],
  templateUrl: './json-formatter.html',
  styleUrl: './json-formatter.scss',
})
export class JsonFormatter {
  protected readonly input = signal('');
  protected readonly indent = signal(2);

  protected readonly result = computed<{ formatted: string; error: string | null }>(() => {
    const raw = this.input().trim();
    if (!raw) return { formatted: '', error: null };
    try {
      return { formatted: JSON.stringify(JSON.parse(raw), null, this.indent()), error: null };
    } catch (e) {
      return { formatted: '', error: e instanceof Error ? e.message : 'Invalid JSON.' };
    }
  });

  protected onInput(value: string): void { this.input.set(value); }

  // mat-select emits a MatSelectChange with the option's own value already
  // typed correctly (a number here, via [value]="2" on each mat-option) -
  // no more reading $any($event.target).value off a raw DOM event.
  protected onIndentChange(value: number): void { this.indent.set(value); }

  protected minify(): void {
    try {
      this.input.set(JSON.stringify(JSON.parse(this.input().trim())));
    } catch {
      // invalid JSON - leave input untouched, the error is already shown
    }
  }
}