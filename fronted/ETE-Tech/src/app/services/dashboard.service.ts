import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let token = '';
    // Verificamos si estamos en el navegador para usar localStorage
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}products/only-products`);
  }

  getServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}products/only-services`);
  }

  getExpenses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}expenses/`, { headers: this.getHeaders() });
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}users/profile`, { headers: this.getHeaders() });
  }
}
