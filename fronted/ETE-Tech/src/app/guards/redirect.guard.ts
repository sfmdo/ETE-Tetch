import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service'; 

export const autoRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return router.parseUrl('/orders'); 
  } else if (authService.isUser()) {
    return router.parseUrl('/user-dashboard'); 
  } else {
    return router.parseUrl('/login'); 
  }
};