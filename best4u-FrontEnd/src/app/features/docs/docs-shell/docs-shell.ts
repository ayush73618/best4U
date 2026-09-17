import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-docs-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './docs-shell.html',
  styleUrl: './docs-shell.scss',
})
export class DocsShell {
  protected readonly tools = [
    { id: 'merge', label: 'Merge PDF', path: 'merge' },
    { id: 'split', label: 'Split PDF', path: 'split' },
    { id: 'compress', label: 'Compress PDF', path: 'compress' },
    { id: 'image', label: 'Image tools', path: 'image' },
  ];
}