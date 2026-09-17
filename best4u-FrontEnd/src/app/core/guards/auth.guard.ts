import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AuthModalService } from '../auth/auth-modal.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const authModalService = inject(AuthModalService);

  if (authService.isAuthenticated()) return true;

  // No more routing to a dedicated /auth/login page — open the modal on
  // top of wherever the user currently is, and remember where they were
  // trying to go so the modal can send them there after login.
  authModalService.open('login', state.url);
  return false;
};