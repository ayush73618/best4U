import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-work-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './work-shell.html',
  styleUrl: './work-shell.scss',
})
export class WorkShell {
  protected readonly sections = [
    { id: 'todos', label: 'To-dos', path: 'todos' },
    { id: 'notes', label: 'Notes', path: 'notes' },
    { id: 'habits', label: 'Habits', path: 'habits' },
  ];
}