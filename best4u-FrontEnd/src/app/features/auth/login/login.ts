import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly loading = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  protected onEmailInput(value: string) { this.email.set(value); }
  protected onPasswordInput(value: string) { this.password.set(value); }

  protected submit(): void {
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Enter your email and password.');
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.login({ email: this.email(), password: this.password() }).subscribe({
      next: () => this.router.navigateByUrl('/work'),
      error: (err) => {
        this.errorMessage.set(err.message);
        this.loading.set(false);
      },
    });
  }
}