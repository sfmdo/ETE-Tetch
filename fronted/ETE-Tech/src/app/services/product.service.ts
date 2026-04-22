import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/all`);
  }

  getOnlyProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/only-products`);
  }

  getOnlyServices(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/only-services`);
  }

  create(product: Product): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  update(id: number, product: Partial<Product>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}