import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../core/auth/auth.service";
import { AuthModalService } from "../../../core/auth/auth-modal.service";
import { FADE_IN } from "../../../animations";

@Component({
  selector: "app-auth-modal",
  standalone: true,
  templateUrl: "./auth-modal.html",
  styleUrl: "./auth-modal.scss",
  animations: [FADE_IN],
})
export class AuthModal {
  protected readonly modalService = inject(AuthModalService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loginEmail = signal("");
  protected readonly loginPassword = signal("");

  protected readonly firstName = signal("");
  protected readonly lastName = signal("");
  protected readonly registerEmail = signal("");
  protected readonly registerPassword = signal("");
  protected readonly mobileNumber = signal("");

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly loading = signal(false);

  protected close(): void {
    this.modalService.close();
    this.errorMessage.set(null);
  }

  protected onBackdropClick(): void {
    this.close();
  }

  protected switchMode(mode: "login" | "register"): void {
    this.modalService.switchMode(mode);
    this.errorMessage.set(null);
  }

  protected onLoginEmailInput(v: string) {
    this.loginEmail.set(v);
  }
  protected onLoginPasswordInput(v: string) {
    this.loginPassword.set(v);
  }
  protected onFirstNameInput(v: string) {
    this.firstName.set(v);
  }
  protected onLastNameInput(v: string) {
    this.lastName.set(v);
  }
  protected onRegisterEmailInput(v: string) {
    this.registerEmail.set(v);
  }
  protected onRegisterPasswordInput(v: string) {
    this.registerPassword.set(v);
  }
  protected onMobileInput(v: string) {
    this.mobileNumber.set(v);
  }

  protected submitLogin(): void {
    if (!this.loginEmail() || !this.loginPassword()) {
      this.errorMessage.set("Enter your email and password.");
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService
      .login({ email: this.loginEmail(), password: this.loginPassword() })
      .subscribe({
        next: () => this.onAuthSuccess(),
        error: (err) => {
          this.errorMessage.set(err.message);
          this.loading.set(false);
        },
      });
  }

  protected submitRegister(): void {
    if (
      !this.firstName() ||
      !this.lastName() ||
      !this.registerEmail() ||
      !this.registerPassword()
    ) {
      this.errorMessage.set("Please fill in all required fields.");
      return;
    }
    if (this.registerPassword().length < 8) {
      this.errorMessage.set("Password must be at least 8 characters.");
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService
      .register({
        firstName: this.firstName(),
        lastName: this.lastName(),
        email: this.registerEmail(),
        password: this.registerPassword(),
        mobileNumber: this.mobileNumber() || undefined,
      })
      .subscribe({
        next: () => this.onAuthSuccess(),
        error: (err) => {
          this.errorMessage.set(err.message);
          this.loading.set(false);
        },
      });
  }

  private onAuthSuccess(): void {
    const user = this.authService.currentUser();
    // Read redirectTo BEFORE close() — close() may clear it
    const redirectTo = this.modalService.redirectTo();
    this.modalService.close();

    if (!user) return;

    if (user.roles.includes("ADMIN")) {
      this.router.navigateByUrl("/admin");
      return;
    }

    if (user.sellerStatus === "APPROVED") {
      this.router.navigateByUrl("/shop/my-listings");
      return;
    }

    // Only navigate if there's a real destination to go to.
    // If the user opened the modal on the page they want to be
    // on already, don't re-render it unnecessarily.
    if (redirectTo && redirectTo !== this.router.url) {
      this.router.navigateByUrl(redirectTo);
    }
  }

  private resetFields(): void {
    this.loginEmail.set("");
    this.loginPassword.set("");
    this.firstName.set("");
    this.lastName.set("");
    this.registerEmail.set("");
    this.registerPassword.set("");
    this.mobileNumber.set("");
  }
}
