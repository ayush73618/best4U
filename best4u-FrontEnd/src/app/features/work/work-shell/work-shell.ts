import { Component } from '@angular/core';
import { TabShell, ShellTab } from '../../../shared/components/tab-shell/tab-shell';

@Component({
  selector: 'app-work-shell',
  standalone: true,
  imports: [TabShell],
  template: `<app-tab-shell [tabs]="tabs" cssPrefix="work-page" ariaLabel="Work sections" umbrella="utilities" currentBrandId="bw4u" />`,
})
export class WorkShell {
  protected readonly tabs: ShellTab[] = [
    { id: 'todos', label: 'To-dos', path: 'todos' },
    { id: 'notes', label: 'Notes', path: 'notes' },
    { id: 'habits', label: 'Habits', path: 'habits' },
  ];
}