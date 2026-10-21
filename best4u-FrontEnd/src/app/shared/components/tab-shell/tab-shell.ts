import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UmbrellaSwitcher } from '../umbrella-switcher/umbrella-switcher';

export interface ShellTab {
  id: string;
  label: string;
  path: string;
}

@Component({
  selector: 'app-tab-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, UmbrellaSwitcher],
  templateUrl: './tab-shell.html',
  styleUrl: './tab-shell.scss',
})
export class TabShell {
  @Input({ required: true }) tabs: ShellTab[] = [];
  @Input({ required: true }) cssPrefix = '';
  @Input() ariaLabel = 'Tools';
  @Input() umbrella?: string;
  @Input() currentBrandId?: string;
}