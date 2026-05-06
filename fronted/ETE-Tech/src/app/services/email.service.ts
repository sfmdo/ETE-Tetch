import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private readonly URL = `${environment.apiUrl}/email`;

  constructor(private http: HttpClient) { }

  enviarNotificacionRecoleccion(orderData: any): Observable<any> {
    return this.http.post(`${this.URL}/send-notification`, orderData);
  }

  enviarClaveTemporal(email: string): Observable<any> {
    return this.http.post(`${this.URL}/reset-password`, { email });
  }
}