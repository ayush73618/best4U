import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-regex-tester',
  standalone: true,
  templateUrl: './regex-tester.html',
  styleUrl: './regex-tester.scss',
})
export class RegexTester {
  protected readonly pattern = signal('');
  protected readonly flags = signal('g');
  protected readonly testString = signal('');

  protected readonly result = computed<{ matchCount: number; error: string | null }>(() => {
    if (!this.pattern() || !this.testString()) return { matchCount: 0, error: null };
    try {
      const regex = new RegExp(this.pattern(), this.flags());
      const found = this.testString().match(regex);
      return { matchCount: found ? found.length : 0, error: null };
    } catch (e) {
      return { matchCount: 0, error: e instanceof Error ? e.message : 'Invalid pattern.' };
    }
  });

  // Builds highlighted HTML by walking real match positions in the raw
  // text, rather than running the regex against already-escaped text -
  // keeps matching correct even if the pattern involves < or > characters.
  protected readonly highlightedHtml = computed<string>(() => {
    const text = this.testString();
    if (!this.pattern() || !text || this.result().error) return this.escapeHtml(text);

    try {
      const flags = this.flags().includes('g') ? this.flags() : this.flags() + 'g';
      const regex = new RegExp(this.pattern(), flags);
      let lastIndex = 0;
      let html = '';
      let match: RegExpExecArray | null;

      while ((match = regex.exec(text)) !== null) {
        html += this.escapeHtml(text.slice(lastIndex, match.index));
        html += `<mark>${this.escapeHtml(match[0])}</mark>`;
        lastIndex = match.index + match[0].length;
        if (match[0].length === 0) regex.lastIndex++; // avoid an infinite loop on zero-width matches
      }
      html += this.escapeHtml(text.slice(lastIndex));
      return html;
    } catch {
      return this.escapeHtml(text);
    }
  });

  protected onPatternInput(value: string): void { this.pattern.set(value); }
  protected onFlagsInput(value: string): void { this.flags.set(value); }
  protected onTestStringInput(value: string): void { this.testString.set(value); }

  private escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}