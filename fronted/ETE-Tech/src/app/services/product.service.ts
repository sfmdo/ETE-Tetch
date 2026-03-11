import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = [
    {
      id_producto: 1,
      codigo_sku: "SKU001",
      nombre: "pc gamer",
      descripcion: "pc gamer de alto rendimiento",
      categoria: "Computadoras",
      tipo_de_item: "Producto",
      precio_costo: 12000,
      precio_venta: 15000,
      tasa_impuesto: 0.16,
      stock_actual: 5,
      stock_minimo: 1,
      imagen: "pc.jpg",
      estado: true,
      cantidad: 1
    },
    {
      id_producto: 2,
      codigo_sku: "SKU002",
      nombre: "memoria ram 16GB",
      descripcion: "DDR4",
      categoria: "Componentes",
      tipo_de_item: "Producto",
      precio_costo: 800,
      precio_venta: 1200,
      tasa_impuesto: 0.16,
      stock_actual: 10,
      stock_minimo: 2,
      imagen: "ram.jpg",
      estado: true,
      cantidad: 1
    }
  ];

  getProducts(): Product[] {
    return this.products;
  }

}