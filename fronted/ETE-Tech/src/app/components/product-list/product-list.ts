import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList {

  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private carritoService: CarritoService
  ) {
    this.productService.getOnlyServices().subscribe(data => {
          this.products = data;
      });
  }

  agregarAlCarrito(producto: Product) {
    this.carritoService.agregarProducto(producto);
  }

}