import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../models/api-response.model";
import { Notification } from "../models/notification.model";
import { Page } from "../models/shop.model";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly baseUrl = `${environment.apiBaseUrl}/notifications`;

  readonly unreadCount = signal(0);
  readonly notifications = signal<Notification[]>([]);

  loadUnreadCount(): void {
    if (!this.authService.isAuthenticated()) {
      this.unreadCount.set(0);
      return;
    }
    this.http
      .get<ApiResponse<number>>(`${this.baseUrl}/unread-count`)
      .subscribe({
        next: (res) => this.unreadCount.set(res.data),
        error: () => {},
      });
  }

  loadNotifications(): void {
    if (!this.authService.isAuthenticated()) return;
    this.http
      .get<ApiResponse<Page<Notification>>>(`${this.baseUrl}?size=20`)
      .subscribe({
        next: (res) => this.notifications.set(res.data.content),
        error: () => {},
      });
  }

  markAllRead(): void {
    this.http
      .post<ApiResponse<void>>(`${this.baseUrl}/mark-read`, {})
      .subscribe(() => {
        this.unreadCount.set(0);
        this.notifications.update((list) =>
          list.map((n) => ({ ...n, isRead: true })),
        );
      });
  }
}
