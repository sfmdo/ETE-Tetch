import { Injectable } from '@angular/core';
import { DetalleVenta } from '../models/detalle-venta.model';

@Injectable({
  providedIn: 'root'
})
export class DetalleVentaService {

  private detalles: DetalleVenta[] = [];

  constructor() {}

  //obtener detalles
  getDetalles(): DetalleVenta[] {
    return this.detalles;
  }

  //agregar producto a la venta
  agregarDetalle(detalle: DetalleVenta): void {
    this.detalles.push(detalle);
  }

  //eiminar detalle
  eliminarDetalle(id_detalle: number): void {
    this.detalles = this.detalles.filter(d => d.id_detalle !== id_detalle);
  }

  //calcular total
  calcularTotal(): number {
    return this.detalles.reduce((total, item) => total + item.importe_linea, 0);
  }

}