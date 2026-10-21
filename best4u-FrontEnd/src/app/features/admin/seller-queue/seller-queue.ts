import { Component, OnInit, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { ApiResponse } from "../../../core/models/api-response.model";

// Matches SellerApplicationResponse from the backend exactly.
interface SellerApplication {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  sellerStatus: string;
  shopName: string | null;
  businessType: string | null;
  primaryCategory: string | null;
  businessPhone: string | null;
  businessAddress: string | null;
  gstNumber: string | null;
  whyDoYouWantToSell: string | null;
}

@Component({
  selector: "app-seller-queue",
  standalone: true,
  templateUrl: "./seller-queue.html",
  styleUrl: "./seller-queue.scss",
})
export class SellerQueue implements OnInit {
  protected readonly applications = signal<SellerApplication[]>([]);
  protected readonly loading = signal(true);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.http
      .get<
        ApiResponse<SellerApplication[]>
      >(`${environment.apiBaseUrl}/admin/sellers/pending`)
      .subscribe((res) => {
        this.applications.set(res.data);
        this.loading.set(false);
      });
  }

  protected approve(userId: number): void {
    this.http
      .put<
        ApiResponse<void>
      >(`${environment.apiBaseUrl}/admin/sellers/${userId}/approve`, {})
      .subscribe(() => this.load());
  }

  protected reject(userId: number): void {
    this.http
      .put<
        ApiResponse<void>
      >(`${environment.apiBaseUrl}/admin/sellers/${userId}/reject`, {})
      .subscribe(() => this.load());
  }
}
