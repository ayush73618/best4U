import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';

const TOKEN_KEY = 'best4u:token';
const USER_KEY = 'best4u:user';

interface AuthResponseData extends User {
  token: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNumber?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Signal-based, matching every other piece of state in this app.
  readonly currentUser = signal<User | null>(this.loadStoredUser());
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  register(payload: RegisterPayload): Observable<ApiResponse<AuthResponseData>> {
    return this.http
      .post<ApiResponse<AuthResponseData>>(`${environment.apiBaseUrl}/auth/register`, payload)
      .pipe(tap((res) => this.storeSession(res.data)));
  }

    login(payload: LoginPayload): Observable<ApiResponse<AuthResponseData>> {
    return this.http
      .post<ApiResponse<AuthResponseData>>(`${environment.apiBaseUrl}/auth/login`, payload)
      .pipe(tap((res) => this.storeSession(res.data)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.router.navigateByUrl('/');
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private storeSession(data: AuthResponseData): void {
    const { token, ...user } = data;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private loadStoredUser(): User | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

    // Updates the local signal + localStorage immediately after a
  // successful "apply for seller" call, without a second network round
  // trip - we already know the outcome, no need to re-fetch it.
  markSellerApplicationPending(): void {
    const user = this.currentUser();
    if (!user) return;
    const updated: User = { ...user, sellerStatus: 'PENDING' };
    this.currentUser.set(updated);
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
  }

    // Called after a profile update to keep the stored session in sync
  // without a full re-login. Only updates the fields the profile form
  // can change — email and roles are never user-editable.
  refreshFromResponse(data: { token: string; firstName: string; lastName: string }): void {
    const current = this.currentUser();
    if (!current) return;

    const updated: User = {
      ...current,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    this.currentUser.set(updated);
  }
}