import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { AuthModalService } from '../../core/auth/auth-modal.service';

// Replaces React's Navbar.js. Search is intentionally a disabled placeholder
// here — platform/search doesn't exist yet, and a fake-looking search box
// that silently does nothing would be worse than an honestly disabled one.
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly authService = inject(AuthService);
  private readonly authModalService = inject(AuthModalService);

  protected openSignIn(): void {
    this.authModalService.open('login');
  }

  protected logout(): void {
    this.authService.logout();
  }
}