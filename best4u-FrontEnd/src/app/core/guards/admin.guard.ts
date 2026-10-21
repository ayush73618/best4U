import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AuthModalService } from '../auth/auth-modal.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const authModalService = inject(AuthModalService);

  if (authService.currentUser()?.roles.includes('ADMIN')) return true;

  // Not logged in at all — open the sign-in modal with the
  // attempted URL remembered so a successful admin login lands
  // them back here, not on the home page.
  if (!authService.isAuthenticated()) {
    authModalService.open('login', state.url);
    return false;
  }

  // Logged in but not an admin — go home, nothing to see here.
  router.navigateByUrl('/');
  return false;
};