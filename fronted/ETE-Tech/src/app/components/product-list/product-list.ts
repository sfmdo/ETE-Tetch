import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CarritoService } from '../../service/carrito.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html'
})
export class ProductList {

  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private carritoService: CarritoService
  ) {
    this.products = this.productService.getProducts();
  }

  agregarAlCarrito(producto: Product) {
    this.carritoService.agregarProducto(producto);
  }

}