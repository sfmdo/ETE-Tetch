import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
<<<<<<< HEAD

export interface OrderPayload {
  Client_ID: number;
  Service_ID: number;
  Brand_Model?: string;
  Reported_Fault?: string;
}
=======
import { environment } from '../../environments/environments';
import { 
  CreateOrderPayload, 
  CreateOrderResponse, 
  AddItemsPayload, 
  AddItemsResponse, 
  DiagnosisPayload, 
  UpdateStatusPayload,
  Order 
} from '../models/order.model';
>>>>>>> 8d6aa06e1cdc20e20fe04c2e5f7543ae73fa11d9

@Injectable({
  providedIn: 'root'
})
export class OrderService {
<<<<<<< HEAD
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  createOrder(orderData: OrderPayload): Observable<any> {
    return this.http.post(this.apiUrl, orderData);
=======
  // Construimos la URL base para órdenes
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  /**
   * 4.1. Crear Orden Inicial (Recepción)
   * Registra el equipo y el servicio base.
   */
  createOrder(payload: CreateOrderPayload): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(`${this.apiUrl}/`, payload);
  }

  /**
   * 4.2. Agregar Items/Refacciones a la Orden
   * Actualiza el costo total y deduce inventario.
   */
  addItems(payload: AddItemsPayload): Observable<AddItemsResponse> {
    return this.http.post<AddItemsResponse>(`${this.apiUrl}/add-items`, payload);
  }

  /**
   * 4.3. Registrar Diagnóstico Técnico
   * El estado cambia automáticamente a COMPLETED en el backend.
   */
  registerDiagnosis(orderId: number, payload: DiagnosisPayload): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/diagnosis`, payload);
  }

  /**
   * 4.4. Actualizar Estado Logístico
   * Cambio manual de estado (Ej: IN_PROGRESS, CANCELLED).
   */
  updateStatus(orderId: number, status: UpdateStatusPayload): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${orderId}/status`, status);
  }

  /**
   * Métodos adicionales útiles (GETters)
   */
  
  // Obtener todas las órdenes
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/get-all`);
  }

  // Obtener una orden específica por ID
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}/full`);
>>>>>>> 8d6aa06e1cdc20e20fe04c2e5f7543ae73fa11d9
  }
}