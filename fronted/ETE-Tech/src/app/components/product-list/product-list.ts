import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CarritoService } from '../../service/carrito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  public carritoService = inject(CarritoService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  products: Product[] = [];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Cargando productos desde el navegador...');
      this.productService.getOnlyServices().subscribe({
        next: (data) => {
          console.log('Productos recibidos en frontend:', data);
          this.products = data;
        },
        error: (err) => {
          console.error('Error cargando productos:', err);
        }
      });
    }
  }

  agregarAlCarrito(producto: Product) {
    this.carritoService.agregarProducto(producto);
  }

  irACheckout() {
    this.router.navigate(['/checkout']);
  }
}