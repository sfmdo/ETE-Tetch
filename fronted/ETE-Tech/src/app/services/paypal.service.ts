import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../enviroment/enviroment';

@Injectable({
    providedIn: 'root'
})
export class PaypalService{
    private apiUrl = environment.apiUrl
    private http = inject(HttpClient)

    crearOrden(items: any[], total: number){
      return this.http.post<{id: string, status: string}> (`${this.apiUrl}payment/create-order`, { items, total });
    }

    capturePago(orderId: string){
      return this.http.post<any>(`${this.apiUrl}payment/capture-order`, { orderId });
    }
}
