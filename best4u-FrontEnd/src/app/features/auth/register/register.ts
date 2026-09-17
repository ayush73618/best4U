import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  protected readonly firstName = signal('');
  protected readonly lastName = signal('');
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly mobileNumber = signal('');
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly loading = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  protected onFirstNameInput(v: string) { this.firstName.set(v); }
  protected onLastNameInput(v: string) { this.lastName.set(v); }
  protected onEmailInput(v: string) { this.email.set(v); }
  protected onPasswordInput(v: string) { this.password.set(v); }
  protected onMobileInput(v: string) { this.mobileNumber.set(v); }

  protected submit(): void {
    if (!this.firstName() || !this.lastName() || !this.email() || !this.password()) {
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }
    if (this.password().length < 8) {
      this.errorMessage.set('Password must be at least 8 characters.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.register({
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      password: this.password(),
      mobileNumber: this.mobileNumber() || undefined,
    }).subscribe({
      next: () => this.router.navigateByUrl('/work'),
      error: (err) => {
        this.errorMessage.set(err.message);
        this.loading.set(false);
      },
    });
  }
}