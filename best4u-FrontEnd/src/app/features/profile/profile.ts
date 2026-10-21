import { Component, OnInit, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RouterLink } from "@angular/router";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../../core/models/api-response.model";
import { AuthService } from "../../core/auth/auth.service";
import { ToastService } from "../../core/services/toast.service";
import { ProfileResponse } from "../../core/models/user.model";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./profile.html",
  styleUrl: "./profile.scss",
})
export class Profile implements OnInit {
  private readonly http = inject(HttpClient);
  protected readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly profile = signal<ProfileResponse | null>(null);
  protected readonly loading = signal(true);
  protected readonly editing = signal(false);
  protected readonly saving = signal(false);
  protected readonly changingPassword = signal(false);

  protected readonly firstName = signal("");
  protected readonly lastName = signal("");
  protected readonly mobileNumber = signal("");
  protected readonly currentPassword = signal("");
  protected readonly newPassword = signal("");
  protected readonly confirmPassword = signal("");

  ngOnInit(): void {
    this.http
      .get<
        ApiResponse<ProfileResponse>
      >(`${environment.apiBaseUrl}/auth/profile`)
      .subscribe({
        next: (res) => {
          this.profile.set(res.data);
          this.loading.set(false);
          this.prefill(res.data);
        },
        error: () => this.loading.set(false),
      });
  }

  private prefill(p: ProfileResponse): void {
    this.firstName.set(p.firstName);
    this.lastName.set(p.lastName);
    this.mobileNumber.set(p.mobileNumber ?? "");
  }

  protected startEdit(): void {
    const p = this.profile();
    if (p) this.prefill(p);
    this.editing.set(true);
  }

  protected cancelEdit(): void {
    this.editing.set(false);
  }

  protected save(): void {
    if (!this.firstName().trim() || !this.lastName().trim()) {
      this.toast.error("First and last name are required.");
      return;
    }
    this.saving.set(true);
    this.http
      .put<
        ApiResponse<{ token: string; firstName: string; lastName: string }>
      >(`${environment.apiBaseUrl}/auth/profile`, { firstName: this.firstName(), lastName: this.lastName(), mobileNumber: this.mobileNumber() || null })
      .subscribe({
        next: (res) => {
          this.saving.set(false);
          this.editing.set(false);
          this.profile.update((p) =>
            p
              ? {
                  ...p,
                  firstName: this.firstName(),
                  lastName: this.lastName(),
                  mobileNumber: this.mobileNumber() || null,
                }
              : p,
          );
          this.authService.refreshFromResponse(res.data);
          this.toast.success("Profile updated!");
        },
        error: (err) => {
          this.saving.set(false);
          this.toast.error(err.message ?? "Could not save profile.");
        },
      });
  }

  protected set(field: string, v: string): void {
    switch (field) {
      case "firstName":
        this.firstName.set(v);
        break;
      case "lastName":
        this.lastName.set(v);
        break;
      case "mobileNumber":
        this.mobileNumber.set(v);
        break;
      case "currentPassword":
        this.currentPassword.set(v);
        break;
      case "newPassword":
        this.newPassword.set(v);
        break;
      case "confirmPassword":
        this.confirmPassword.set(v);
        break;
    }
  }

  protected get sellerLabel(): string {
    const m: Record<string, string> = {
      NONE: "Not applied",
      PENDING: "Application pending",
      APPROVED: "Approved seller",
      REJECTED: "Application rejected",
    };
    return m[this.profile()?.sellerStatus ?? "NONE"];
  }
}
