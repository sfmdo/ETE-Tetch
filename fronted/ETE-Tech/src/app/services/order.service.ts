import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderPayload {
  Client_ID: number;
  Service_ID: number;
  Brand_Model?: string;
  Reported_Fault?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  createOrder(orderData: OrderPayload): Observable<any> {
    return this.http.post(this.apiUrl, orderData);
  }
}