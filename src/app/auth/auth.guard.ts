import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  let router = inject(Router);
  let authService = inject(AuthService);
  return authService.getAuthState().pipe(
    map((user) => {
      if (!user) {
        router.navigate(['/auth/login']);
        return false;
      }
      router.navigate(['/dashboard']);
      return true;
    })
  );
};
