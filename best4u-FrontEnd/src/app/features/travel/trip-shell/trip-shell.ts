import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabShell } from '../../../shared/components/tab-shell/tab-shell';
import type { ShellTab } from '../../../shared/components/tab-shell/tab-shell';

@Component({
  selector: 'app-trip-shell',
  standalone: true,
  imports: [TabShell],
  template: `<app-tab-shell [tabs]="tabs" cssPrefix="travel-page" ariaLabel="Trip sections" />`,
})
export class TripShell {
  // tripId itself isn't needed here - it's already baked into each child
  // tool's own route paths (relative routerLinks resolve against it
  // automatically); each tool reads it directly from its own ActivatedRoute.
  private readonly route = inject(ActivatedRoute);

  protected readonly tabs: ShellTab[] = [
    { id: 'itinerary', label: 'Itinerary', path: 'itinerary' },
    { id: 'packing', label: 'Packing', path: 'packing' },
    { id: 'budget', label: 'Budget', path: 'budget' },
    { id: 'notes', label: 'Notes', path: 'notes' },
  ];
}