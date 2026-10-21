import { Component } from '@angular/core';
import { TabShell, ShellTab } from '../../../shared/components/tab-shell/tab-shell';

@Component({
  selector: 'app-docs-shell',
  standalone: true,
  imports: [TabShell],
  template: `<app-tab-shell [tabs]="tabs" cssPrefix="docs-page" ariaLabel="Document Management" umbrella="utilities" currentBrandId="bd4u" />`,
})
export class DocsShell {
  protected readonly tabs: ShellTab[] = [
    { id: 'merge', label: 'Merge PDF', path: 'merge' },
    { id: 'split', label: 'Split PDF', path: 'split' },
    { id: 'compress', label: 'Compress PDF', path: 'compress' },
    { id: 'image', label: 'Image tools', path: 'image' },
  ];
}