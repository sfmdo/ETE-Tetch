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
      imagen: "data:image/png;base64,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",
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
      imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4HJB4_V9vEnPdHO8EtR-KPalOhEVS3N3MVQ&s",
      estado: true,
      cantidad: 1
    }
  ];

  getProducts(): Product[] {
    return this.products;
  }

}