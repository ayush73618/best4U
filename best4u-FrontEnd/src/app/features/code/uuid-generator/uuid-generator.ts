import { Component, computed, signal } from '@angular/core';
import { CopyButton } from '../../../shared/components/copy-button/copy-button';

@Component({
  selector: 'app-uuid-generator',
  standalone: true,
  imports: [CopyButton],
  templateUrl: './uuid-generator.html',
  styleUrl: './uuid-generator.scss',
})
export class UuidGenerator {
  protected readonly count = signal(1);
  protected readonly uuids = signal<string[]>([crypto.randomUUID()]);
  protected readonly allAsText = computed(() => this.uuids().join('\n'));

  protected onCountInput(value: string): void {
    this.count.set(Math.max(1, Math.min(50, Number(value) || 1)));
  }

  protected generate(): void {
    this.uuids.set(Array.from({ length: this.count() }, () => crypto.randomUUID()));
  }
}