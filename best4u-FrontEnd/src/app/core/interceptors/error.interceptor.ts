import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { catchError, from, switchMap, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Only treat a 401 as "session expired" if the user was
        // actually logged in when the request fired. A wrong password
        // on /auth/login also returns 401, but the user was never
        // authenticated in the first place — navigating them away
        // from the login modal in that case is the bug.
        const isLoginAttempt = req.url.includes('/auth/login')
            || req.url.includes('/auth/register');

        if (!isLoginAttempt && authService.isAuthenticated()) {
          authService.logout();
          router.navigateByUrl('/');
        }
        // For login/register failures, or unauthenticated requests,
        // just let the error propagate — the modal's own error handler
        // will display the message to the user.
      }

      // File-download requests use responseType: 'blob', so an error
      // body arrives as a Blob too, not parsed JSON - read it as text.
      if (error.error instanceof Blob) {
        return from(error.error.text()).pipe(
          switchMap((text) => {
            let message = 'Something went wrong. Please try again in a moment.';
            try {
              message = JSON.parse(text).message ?? message;
            } catch {
              // body wasn't JSON — keep the generic message
            }
            return throwError(() => new Error(message));
          })
        );
      }

      const message =
        error.error?.message ?? 'Something went wrong. Please try again in a moment.';
      return throwError(() => new Error(message));
    })
  );
};