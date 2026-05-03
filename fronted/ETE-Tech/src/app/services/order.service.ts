import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { 
  CreateOrderPayload, 
  CreateOrderResponse, 
  AddItemsPayload, 
  AddItemsResponse, 
  DiagnosisPayload, 
  UpdateStatusPayload,
  RegisterPaymentPayload,
  RegisterPaymentResponse,
  Order 
} from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }


  createOrder(payload: CreateOrderPayload): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(`${this.apiUrl}/`, payload);
  }

  addItems(payload: AddItemsPayload): Observable<AddItemsResponse> {
    return this.http.post<AddItemsResponse>(`${this.apiUrl}/add-items`, payload);
  }

  registerDiagnosis(orderId: number, payload: DiagnosisPayload): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/diagnosis`, payload);
  }

  updateStatus(orderId: number, status: UpdateStatusPayload): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${orderId}/status`, status);
  }

  registerPayment(orderId: number, payload: RegisterPaymentPayload): Observable<RegisterPaymentResponse> {
    return this.http.post<RegisterPaymentResponse>(`${this.apiUrl}/${orderId}/pay`, payload);
  }

  getClientOrders(clientId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/client/${clientId}`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/get-all`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}/full`);
  }

  
}