import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandRegistryService } from '../../core/services/brand-registry.service';

// Replaces React's HomePage.js/ShowItems.js — rebuilt, not ported. This is
// the "What do you need today?" homepage from Section 14 of the vision
// doc: search-first, organized by umbrella, honest about what's actually
// built yet (everything below is 'planned' until a real feature exists —
// except BT4U, which now links to a real working calculator).
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly registry = inject(BrandRegistryService);
}