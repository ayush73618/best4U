import { Injectable, signal } from '@angular/core';

export type AuthModalMode = 'login' | 'register';

@Injectable({ providedIn: 'root' })
export class AuthModalService {
  readonly isOpen = signal(false);
  readonly mode = signal<AuthModalMode>('login');
  // Where to send the user after a successful login/register, only set
  // when a route guard opened this (they were blocked from somewhere
  // specific) — null when they just clicked "Sign in" themselves.
  readonly redirectTo = signal<string | null>(null);

  open(mode: AuthModalMode = 'login', redirectTo: string | null = null): void {
    this.mode.set(mode);
    this.redirectTo.set(redirectTo);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.redirectTo.set(null);
  }

  switchMode(mode: AuthModalMode): void {
    this.mode.set(mode);
  }
}