// paypal.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class PaypalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`; // O la ruta que definiste

  crearOrden(data: { items: any[], total: number }) {
    return this.http.post<any>(`${this.apiUrl}/paypal/create`, data);
  }

  capturarOrden(orderId: string) {
    return this.http.post<any>(`${this.apiUrl}/paypal/capture`, { orderId });
  }
}