import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');

  // 1. Verificación básica: ¿Está logueado?
  if (!token || !userJson) {
    router.navigate(['/login']);
    return false;
  }

  const user = JSON.parse(userJson);

  // 2. Verificación de Roles: ¿Tiene permiso para esta ruta específica?
  // Extraemos el rol requerido definido en la configuración de rutas
  const requiredRole = route.data['role'];

  if (requiredRole) {
    if (user.Role === requiredRole) {
      return true; // El rol coincide (ej. es Admin y la ruta pide Admin)
    } else {
      // Tiene token pero no el rol necesario (ej. User intentando entrar a Staff)
      console.warn(`Acceso denegado: Se requiere rol ${requiredRole}`);
      router.navigate(['/catalog']); // Lo mandamos a una zona segura para Users
      return false;
    }
  }

  // 3. Si la ruta no pide un rol específico, con estar logueado basta
  return true;
};