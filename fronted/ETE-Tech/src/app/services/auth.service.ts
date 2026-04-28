import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments'; // Importamos el entorno
import { Router } from '@angular/router';

import { UserRegisterPayload,RegisterResponse } from '../models/user.model';

export interface LoginResponse {
  message: string;
  user: {
    User_ID: number;
    Full_Name: string;
    Email: string;
    Phone: string;
    Role: string;
    Status: number;
  };
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Construimos la URL usando la base del entorno centralizado
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getCurrentUserId(): number {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // Usamos User_ID que es como viene en tu LoginResponse
        return user.User_ID || 0;
      } catch (e) {
        console.error('Error al parsear el usuario de la sesión', e);
        return 0;
      }
    }
    return 0;
  }

  /**
   * Obtiene el objeto completo del usuario si lo necesitas
   */
  getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
  /**
   * Realiza la petición de login al servidor
   */
  login(Email: string, Password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { Email, Password });
  }

  /**
   * Limpia los datos de sesión y redirige al login
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    console.log('Sesión cerrada correctamente 🚪');
  }

  /**
   * Verifica si existe un token en el almacenamiento local
   * (Útil para comprobaciones rápidas en componentes)
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  register(userData: UserRegisterPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData);
  }
}