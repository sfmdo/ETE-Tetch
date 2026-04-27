import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private apiUrl = `${environment.apiUrl}products`;

  constructor(private http: HttpClient) { }

  getOnlyServices(): Observable<Product[]> {
    console.log('Llamando a:', `${this.apiUrl}/only-services`);
    return this.http.get<Product[]>(`${this.apiUrl}/only-services`);
  }
}