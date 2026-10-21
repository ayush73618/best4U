import { Component } from '@angular/core';
import { TabShell, ShellTab } from '../../../shared/components/tab-shell/tab-shell';

@Component({
  selector: 'app-code-shell',
  standalone: true,
  imports: [TabShell],
  template: `<app-tab-shell [tabs]="tabs" cssPrefix="dev-page" ariaLabel="Coding Utilities" umbrella="utilities" currentBrandId="bc4u" />`,
})
export class CodeShell {
  protected readonly tabs: ShellTab[] = [
    { id: 'json', label: 'JSON', path: 'json' },
    { id: 'jwt', label: 'JWT', path: 'jwt' },
    { id: 'base64', label: 'Base64', path: 'base64' },
    { id: 'uuid', label: 'UUID', path: 'uuid' },
    { id: 'hash', label: 'Hash', path: 'hash' },
    { id: 'timestamp', label: 'Timestamp', path: 'timestamp' },
    { id: 'regex', label: 'Regex', path: 'regex' },
    { id: 'url', label: 'URL', path: 'url' },
    { id: 'case', label: 'Case', path: 'case' },
    { id: 'color', label: 'Color', path: 'color' },
  ];
}