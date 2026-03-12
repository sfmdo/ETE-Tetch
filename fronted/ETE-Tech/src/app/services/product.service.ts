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
      nombre: "Diagnostico de computadora",
      descripcion: "Diagnostico de computadora",
      categoria: "Servicios",
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
      nombre: "Instalacion de Software",
      descripcion: "Instalacion de Software en computadora (Windows,Linux, VPN, etc)",
      categoria: "Servicios",
      tipo_de_item: "Producto",
      precio_costo: 800,
      precio_venta: 1200,
      tasa_impuesto: 0.16,
      stock_actual: 10,
      stock_minimo: 2,
      imagen: "ram.jpg",
      estado: true,
      cantidad: 1
    },
    {
      id_producto: 3,
      codigo_sku: "SKU003",
      nombre: "Mantenimiento de computadora",
      descripcion: "Mantenimiento preventivo y correctivo de computadora",
      categoria: "Servicios",
      tipo_de_item: "Producto",
      precio_costo: 800,
      precio_venta: 1200,
      tasa_impuesto: 0.16,
      stock_actual: 10,
      stock_minimo: 2,
      imagen: "ram.jpg",
      estado: true,
      cantidad: 1
    },
    {
      id_producto: 4,
      codigo_sku: "SKU004",
      nombre: "Mantenimiento de celular",
      descripcion: "Mantenimiento preventivo y correctivo de celular",
      categoria: "Servicios",
      tipo_de_item: "Producto",
      precio_costo: 800,
      precio_venta: 1200,
      tasa_impuesto: 0.16,
      stock_actual: 10,
      stock_minimo: 2,
      imagen: "ram.jpg",
      estado: true,
      cantidad: 1
    },
    {
      id_producto: 5,
      codigo_sku: "SKU005",
      nombre: "Diagnostico de celular",
      descripcion: "Diagnostico de celular",
      categoria: "Servicios",
      tipo_de_item: "Producto",
      precio_costo: 800,
      precio_venta: 1200,
      tasa_impuesto: 0.16,
      stock_actual: 10,
      stock_minimo: 2,
      imagen: "ram.jpg",
      estado: true,
      cantidad: 1
    },
    {
      id_producto: 6,
      codigo_sku: "SKU006",
      nombre: "Instalacion de software en celular",
      descripcion: "Instalacion de software en celular",
      categoria: "Servicios",
      tipo_de_item: "Producto",
      precio_costo: 800,
      precio_venta: 1200,
      tasa_impuesto: 0.16,
      stock_actual: 10,
      stock_minimo: 2,
      imagen: "ram.jpg",
      estado: true,
      cantidad: 1
    },
    {
      id_producto: 7,
      codigo_sku: "SKU007",
      nombre: "Instalacion de software en consolas",
      descripcion: "Instalacion de software en consolas ",
      categoria: "Servicios",
      tipo_de_item: "Producto",
      precio_costo: 800,
      precio_venta: 1200,
      tasa_impuesto: 0.16,
      stock_actual: 10,
      stock_minimo: 2,
      imagen: "ram.jpg",
      estado: true,
      cantidad: 1
    },
    {
      id_producto: 8,
      codigo_sku: "SKU008",
      nombre: "Diagnostico de consolas",
      descripcion: " evaluacion del daño o costo de reparacion de consolas",
      categoria: "Servicios",
      tipo_de_item: "Producto",
      precio_costo: 800,
      precio_venta: 1200,
      tasa_impuesto: 0.16,
      stock_actual: 10,
      stock_minimo: 2,
      imagen: "ram.jpg",
      estado: true,
      cantidad: 1
    },
    {
      id_producto: 9,
      codigo_sku: "SKU009",
      nombre: "Mantenimiento de consolas",
      descripcion: "Mantenimiento de  consolas",
      categoria: "Servicios",
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