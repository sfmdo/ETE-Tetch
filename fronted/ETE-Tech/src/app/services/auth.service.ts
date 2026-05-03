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
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getCurrentUser() {
    const userData = localStorage.getItem('user');
    try {
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      return null;
    }
  }

  getCurrentUserId(): number {
    const user = this.getCurrentUser();
    return user?.User_ID || 0;
  }

  login(Email: string, Password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { Email, Password });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    console.log('Sesión cerrada correctamente 🚪');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  register(userData: UserRegisterPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData);
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.Role === 'Admin'; 
  }

  isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.Role === 'User';
  }
}