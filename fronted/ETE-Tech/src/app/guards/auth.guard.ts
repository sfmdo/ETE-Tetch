import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');

  if (!token || !userJson) {
    router.navigate(['/login']);
    return false;
  }

  const user = JSON.parse(userJson);

  const requiredRole = route.data['role'];

  if (requiredRole) {
    if (user.Role === requiredRole) {
      return true; 
    } else {

      console.warn(`Acceso denegado: Se requiere rol ${requiredRole}`);
      router.navigate(['/catalog']); 
      return false;
    }
  }

  return true;
};