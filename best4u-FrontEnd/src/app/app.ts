import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { CategoryBar } from './layout/category-bar/category-bar';
import { AuthModal } from './shared/components/auth-modal/auth-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, CategoryBar, AuthModal],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = 'Best4U';
}