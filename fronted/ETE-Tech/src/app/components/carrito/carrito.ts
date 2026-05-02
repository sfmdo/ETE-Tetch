import { Component, Signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Product } from '../../models/product.model';
import { TopNavbar } from '../top-navbar/top-navbar';
import { SideNavbar } from '../side-navbar/side-navbar';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, TopNavbar, SideNavbar],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {
  carrito: Signal<Product[]>;
  total: Signal<number>;

  constructor(private carritoService: CarritoService) {
    this.carrito = this.carritoService.Lista;
    this.total = this.carritoService.total;
  }

  eliminar(producto: Product) {
    this.carritoService.eliminarProducto(producto);
  }

  vaciar() {
    this.carritoService.vaciarCarrito();
  }

  exportarXML() {
    this.carritoService.exportarXML();
  }
}

