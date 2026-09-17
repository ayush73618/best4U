import { Component, inject } from '@angular/core';
import { BrandRegistryService } from '../../core/services/brand-registry.service';

// Shows the 3 umbrellas (Shopping / Utilities / Lifestyle) with their
// sub-brand chips, per the agreed nav design: umbrellas up top, not all
// 10 sub-brands listed flat. Chips are not yet clickable — none of the
// sub-brand routes exist as real features yet, so pretending they're
// navigable would be misleading (Section 24).
@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  protected readonly registry = inject(BrandRegistryService);
}