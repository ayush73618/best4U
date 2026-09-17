import { Component, HostListener, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type Operator = '+' | '-' | '*' | '/';

const OPERATOR_SYMBOLS: Record<Operator, string> = {
  '+': '+',
  '-': '\u2212',
  '*': '\u00d7',
  '/': '\u00f7',
};

// Caps how many digits a user can type in — prevents the display from
// overflowing the card on a phone screen.
const MAX_DIGITS = 15;

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './calculator.html',
  styleUrl: './calculator.scss',
})
export class Calculator {
  // The raw string being typed, e.g. "12." or "0.50" — kept as a string
  // (not a number) so a trailing decimal point or trailing zeros don't
  // get silently eaten while the user is still typing.
  protected readonly display = signal('0');
  protected readonly hasError = signal(false);

  private previousValue: number | null = null;
  private readonly pendingOperator = signal<Operator | null>(null);
  private readonly overwrite = signal(true);

  // The small "12 ×" line above the main display, so the user always
  // knows what's already been entered instead of just seeing a bare number.
  protected readonly expression = computed(() => {
    const op = this.pendingOperator();
    if (this.previousValue === null || !op) return '';
    return `${this.formatNumber(this.previousValue)} ${OPERATOR_SYMBOLS[op]}`;
  });

  protected readonly formattedDisplay = computed(() => this.formatForDisplay(this.display()));

  protected inputDigit(digit: string): void {
    if (this.hasError()) this.clearAll();
    const current = this.display();
    if (this.overwrite()) {
      this.display.set(digit === '0' ? '0' : digit);
      this.overwrite.set(false);
      return;
    }
    if (current.replace('-', '').replace('.', '').length >= MAX_DIGITS) return;
    this.display.set(current === '0' ? digit : current + digit);
  }

  protected inputDecimal(): void {
    if (this.hasError()) this.clearAll();
    if (this.overwrite()) {
      this.display.set('0.');
      this.overwrite.set(false);
      return;
    }
    if (!this.display().includes('.')) {
      this.display.set(this.display() + '.');
    }
  }

  protected chooseOperator(op: Operator): void {
    if (this.hasError()) return;
    // Chained calculations, e.g. "5 + 3 + 2 =" — if there's already a
    // pending operator and the user has typed a new number, resolve that
    // step first instead of discarding it.
    if (this.pendingOperator() && !this.overwrite()) {
      this.equals();
    }
    this.previousValue = Number(this.display());
    this.pendingOperator.set(op);
    this.overwrite.set(true);
  }

  protected equals(): void {
    const op = this.pendingOperator();
    if (this.hasError() || this.previousValue === null || !op) return;

    const current = Number(this.display());
    const result = this.compute(this.previousValue, current, op);

    if (result === null) {
      this.display.set('Error');
      this.hasError.set(true);
    } else {
      this.display.set(this.stringifyResult(result));
    }
    this.previousValue = null;
    this.pendingOperator.set(null);
    this.overwrite.set(true);
  }

  protected toggleSign(): void {
    if (this.hasError()) return;
    const current = this.display();
    if (current === '0') return;
    this.display.set(current.startsWith('-') ? current.slice(1) : '-' + current);
  }

  protected inputPercent(): void {
    if (this.hasError()) return;
    const value = Number(this.display()) / 100;
    this.display.set(this.stringifyResult(value));
    this.overwrite.set(true);
  }

  protected backspace(): void {
    if (this.hasError() || this.overwrite()) {
      this.clearAll();
      return;
    }
    const current = this.display();
    const next = current.length > 1 ? current.slice(0, -1) : '0';
    this.display.set(next === '-' ? '0' : next);
    if (next === '0') this.overwrite.set(true);
  }

  protected clearAll(): void {
    this.display.set('0');
    this.previousValue = null;
    this.pendingOperator.set(null);
    this.overwrite.set(true);
    this.hasError.set(false);
  }

  // Full keyboard support (Section 16/19: don't force mouse-only interaction).
  @HostListener('window:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key >= '0' && event.key <= '9') {
      this.inputDigit(event.key);
    } else if (event.key === '.') {
      this.inputDecimal();
    } else if (event.key === '+' || event.key === '-') {
      this.chooseOperator(event.key);
    } else if (event.key === '*') {
      this.chooseOperator('*');
    } else if (event.key === '/') {
      event.preventDefault(); // avoid triggering the browser's quick-find
      this.chooseOperator('/');
    } else if (event.key === 'Enter' || event.key === '=') {
      event.preventDefault();
      this.equals();
    } else if (event.key === 'Backspace') {
      this.backspace();
    } else if (event.key === 'Escape' || event.key.toLowerCase() === 'c') {
      this.clearAll();
    } else if (event.key === '%') {
      this.inputPercent();
    }
  }

  private compute(a: number, b: number, op: Operator): number | null {
    switch (op) {
      case '+':
        return this.round(a + b);
      case '-':
        return this.round(a - b);
      case '*':
        return this.round(a * b);
      case '/':
        return b === 0 ? null : this.round(a / b);
    }
  }

  // Guards against classic floating-point artifacts (0.1 + 0.2 !== 0.3).
  private round(value: number): number {
    return Math.round((value + Number.EPSILON) * 1e10) / 1e10;
  }

  private stringifyResult(value: number): string {
    if (!Number.isFinite(value)) return 'Error';
    const fixed = parseFloat(value.toPrecision(12));
    return String(fixed);
  }

  private formatForDisplay(raw: string): string {
    if (raw === 'Error') return raw;
    const negative = raw.startsWith('-');
    const unsigned = negative ? raw.slice(1) : raw;
    const [intPart, decPart] = unsigned.split('.');
    const groupedInt = Number(intPart || '0').toLocaleString('en-US');
    const result = decPart !== undefined ? `${groupedInt}.${decPart}` : groupedInt;
    return negative ? `-${result}` : result;
  }

  private formatNumber(value: number): string {
    return this.formatForDisplay(this.stringifyResult(value));
  }
}