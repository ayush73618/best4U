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
        authService.logout();
        router.navigateByUrl('/auth/login');
      }

      // File-download requests use responseType: 'blob', so an error body
      // arrives as a Blob too, not parsed JSON - read it as text first.
      if (error.error instanceof Blob) {
        return from(error.error.text()).pipe(
          switchMap((text) => {
            let message = 'Something went wrong. Please try again in a moment.';
            try {
              message = JSON.parse(text).message ?? message;
            } catch {
              // body wasn't JSON - keep the generic message
            }
            return throwError(() => new Error(message));
          })
        );
      }

      const message = error.error?.message ?? 'Something went wrong. Please try again in a moment.';
      return throwError(() => new Error(message));
    })
  );
};