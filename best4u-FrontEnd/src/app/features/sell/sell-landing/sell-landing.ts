import { Component, OnInit, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, RouterLink } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { ApiResponse } from "../../../core/models/api-response.model";
import { AuthService } from "../../../core/auth/auth.service";
import { AuthModalService } from "../../../core/auth/auth-modal.service";
import { Category } from "../../../core/models/shop.model";
import { SellerApplicationRequest } from "../../../core/models/user.model";

type Step =
  | "intro"
  | "form"
  | "submitted"
  | "approved"
  | "pending"
  | "rejected";

@Component({
  selector: "app-sell-landing",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./sell-landing.html",
  styleUrl: "./sell-landing.scss",
})
export class SellLanding implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  protected readonly authService = inject(AuthService);
  private readonly authModalService = inject(AuthModalService);

  protected readonly step = signal<Step>("intro");
  protected readonly categories = signal<Category[]>([]);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  // Form fields
  protected readonly shopName = signal("");
  protected readonly businessType = signal("INDIVIDUAL");
  protected readonly primaryCategory = signal("");
  protected readonly businessPhone = signal("");
  protected readonly businessAddress = signal("");
  protected readonly gstNumber = signal("");
  protected readonly bankAccountName = signal("");
  protected readonly bankAccountNumber = signal("");
  protected readonly bankIfscCode = signal("");
  protected readonly upiId = signal("");
  protected readonly whyDoYouWantToSell = signal("");

  ngOnInit(): void {
    this.http
      .get<ApiResponse<Category[]>>(`${environment.apiBaseUrl}/categories`)
      .subscribe((res) => this.categories.set(res.data));

    const status = this.authService.currentUser()?.sellerStatus;
    if (status === "PENDING") this.step.set("pending");
    else if (status === "APPROVED") this.step.set("approved");
    else if (status === "REJECTED") this.step.set("rejected");
    else this.step.set("intro");
  }

  protected signIn(): void {
    this.authModalService.open("login", "/sell");
  }

  protected startForm(): void {
    if (!this.authService.isAuthenticated()) {
      this.signIn();
      return;
    }
    this.step.set("form");
  }

  protected set(field: string, value: string): void {
    switch (field) {
      case "shopName":
        this.shopName.set(value);
        break;
      case "businessType":
        this.businessType.set(value);
        break;
      case "primaryCategory":
        this.primaryCategory.set(value);
        break;
      case "businessPhone":
        this.businessPhone.set(value);
        break;
      case "businessAddress":
        this.businessAddress.set(value);
        break;
      case "gstNumber":
        this.gstNumber.set(value);
        break;
      case "bankAccountName":
        this.bankAccountName.set(value);
        break;
      case "bankAccountNumber":
        this.bankAccountNumber.set(value);
        break;
      case "bankIfscCode":
        this.bankIfscCode.set(value);
        break;
      case "upiId":
        this.upiId.set(value);
        break;
      case "whyDoYouWantToSell":
        this.whyDoYouWantToSell.set(value);
        break;
    }
  }

  protected submit(): void {
    if (!this.shopName().trim()) {
      this.errorMessage.set("Shop name is required.");
      return;
    }
    if (!this.businessPhone().trim()) {
      this.errorMessage.set("Business phone is required.");
      return;
    }
    if (!this.whyDoYouWantToSell().trim()) {
      this.errorMessage.set("Please tell us why you want to sell on Best4U.");
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const payload: SellerApplicationRequest = {
      shopName: this.shopName(),
      businessType: this.businessType(),
      primaryCategory: this.primaryCategory(),
      businessPhone: this.businessPhone(),
      businessAddress: this.businessAddress(),
      gstNumber: this.gstNumber(),
      bankAccountName: this.bankAccountName(),
      bankAccountNumber: this.bankAccountNumber(),
      bankIfscCode: this.bankIfscCode(),
      upiId: this.upiId(),
      whyDoYouWantToSell: this.whyDoYouWantToSell(),
    };

    this.http
      .post<
        ApiResponse<void>
      >(`${environment.apiBaseUrl}/auth/apply-seller`, payload)
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.authService.markSellerApplicationPending();
          this.step.set("submitted");
        },
        error: (err) => {
          this.submitting.set(false);
          this.errorMessage.set(
            err.message ?? "Something went wrong. Please try again.",
          );
        },
      });
  }
}
