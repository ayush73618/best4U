import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandRegistryService } from '../../core/services/brand-registry.service';

// This was previously (wrongly) called "Sidebar" — a sidebar is vertical,
// this renders as a horizontal bar under the header, so the name was
// actively misleading about what the component does. Renamed to match
// reality: a horizontal bar of umbrella categories, each expandable to
// its sub-brands. Chips show plain words (brand.shortLabel), not internal
// codes (brand.code) — a first-time user has no way to know "BP4U" means
// "Products," and a hover-only tooltip doesn't help on mobile.
@Component({
  selector: 'app-category-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './category-bar.html',
  styleUrl: './category-bar.scss',
})
export class CategoryBar {
  protected readonly registry = inject(BrandRegistryService);
}