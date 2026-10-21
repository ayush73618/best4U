import { Component, computed, signal } from '@angular/core';
import { CopyButton } from '../../../shared/components/copy-button/copy-button';

@Component({
  selector: 'app-case-converter',
  standalone: true,
  imports: [CopyButton],
  templateUrl: './case-converter.html',
  styleUrl: './case-converter.scss',
})
export class CaseConverter {
  protected readonly input = signal('');

  // Splits on spaces, hyphens, underscores, and camelCase boundaries, so
  // input in any style converts cleanly to any other.
  private readonly words = computed<string[]>(() => {
    const raw = this.input().trim();
    if (!raw) return [];
    return raw.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(/[\s_-]+/).filter(Boolean).map((w) => w.toLowerCase());
  });

  protected readonly camelCase = computed(() => this.words().map((w, i) => (i === 0 ? w : this.capitalize(w))).join(''));
  protected readonly pascalCase = computed(() => this.words().map((w) => this.capitalize(w)).join(''));
  protected readonly snakeCase = computed(() => this.words().join('_'));
  protected readonly kebabCase = computed(() => this.words().join('-'));
  protected readonly constantCase = computed(() => this.words().join('_').toUpperCase());
  protected readonly titleCase = computed(() => this.words().map((w) => this.capitalize(w)).join(' '));

  protected onInput(value: string): void { this.input.set(value); }

  private capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}