import { Component, ElementRef, HostListener, Input, computed, inject, signal } from '@angular/core';
import { UmbrellaId } from '../../../core/models/brand.model';
import { BrandRegistryService } from '../../../core/services/brand-registry.service';

@Component({
  selector: 'app-umbrella-switcher',
  standalone: true,
  templateUrl: './umbrella-switcher.html',
  styleUrl: './umbrella-switcher.scss',
})
export class UmbrellaSwitcher {
  @Input({ required: true }) umbrella!: string;
  @Input() currentBrandId?: string;

  private readonly registry = inject(BrandRegistryService);
  private readonly elementRef = inject(ElementRef);

  protected readonly isOpen = signal(false);

  protected readonly siblings = computed(() => this.registry.brandsByUmbrella(this.umbrella));

  protected readonly umbrellaLabel = computed(() => {
    const found = this.registry.umbrellas.find((u) => u.id === this.umbrella);
    return found ? found.name : this.umbrella;
  });

  protected toggle(): void { this.isOpen.update((v) => !v); }
  protected close(): void { this.isOpen.set(false); }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) this.close();
  }
}