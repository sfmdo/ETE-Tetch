import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit {

  products: Product[] = [];

  filter: 'ALL' | 'PRODUCT' | 'SERVICE' = 'ALL';

  loading = false;
  errorMessage = '';
  successMessage = '';

  editingId: number | null = null;

  form: Product = {
    SKU_Code: '',
    Name: '',
    Description: '',
    Category: '',
    Item_Type: 'PRODUCT',

    Cost_Price: 0,
    Sale_Price: 0,
    Tax_Rate: 0.16,
    Final_Price: 0,

    Current_Stock: 0,
    Minimum_Stock: 0,

    Status: 1,
    Image: ''
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    let request$;

    switch (this.filter) {
      case 'PRODUCT':
        request$ = this.productService.getOnlyProducts();
        break;

      case 'SERVICE':
        request$ = this.productService.getOnlyServices();
        break;

      default:
        request$ = this.productService.getAll();
        break;
    }

    request$.subscribe({
      next: (response: Product[]) => {
        this.products = response;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  changeFilter(filter: 'ALL' | 'PRODUCT' | 'SERVICE'): void {
    this.filter = filter;
    this.loadProducts();
  }

  onItemTypeChange(): void {
    if (this.form.Item_Type === 'SERVICE') {
      this.form.Current_Stock = 0;
      this.form.Minimum_Stock = 0;
    }
  }

  calculateFinalPrice(): void {
    const salePrice = Number(this.form.Sale_Price) || 0;
    const taxRate = Number(this.form.Tax_Rate) || 0;

    this.form.Final_Price = +(salePrice * (1 + taxRate)).toFixed(2);
  }

  save(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.validateForm()) {
      return;
    }

    this.calculateFinalPrice();

    if (this.editingId !== null) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  private createProduct(): void {
    this.loading = true;

    const payload: Product = {
      ...this.form
    };

    delete payload.Product_ID;
    delete payload.Final_Price;

    this.productService.create(payload).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Registro creado correctamente';
        this.resetForm();
        this.loadProducts();
      },
      error: (error) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  private updateProduct(): void {
    if (this.editingId === null) return;

    this.loading = true;

    const payload: Partial<Product> = {
      ...this.form
    };

    delete payload.Product_ID;
    delete payload.Final_Price;

    this.productService.update(this.editingId, payload).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Registro actualizado correctamente';
        this.resetForm();
        this.loadProducts();
      },
      error: (error) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  edit(product: Product): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.editingId = product.Product_ID || null;

    this.form = {
      Product_ID: product.Product_ID,
      SKU_Code: product.SKU_Code,
      Name: product.Name,
      Description: product.Description,
      Category: product.Category,
      Item_Type: product.Item_Type,

      Cost_Price: product.Cost_Price,
      Sale_Price: product.Sale_Price,
      Tax_Rate: product.Tax_Rate,
      Final_Price: product.Final_Price,

      Current_Stock: product.Current_Stock,
      Minimum_Stock: product.Minimum_Stock,

      Status: product.Status,
      Image: product.Image || ''
    };
  }

  remove(product: Product): void {
    if (!product.Product_ID) return;

    const confirmed = confirm(
      `¿Seguro que deseas eliminar "${product.Name}"?`
    );

    if (!confirmed) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.productService.delete(product.Product_ID).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Registro eliminado correctamente';
        this.loadProducts();
      },
      error: (error) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  resetForm(): void {
    this.editingId = null;

    this.form = {
      SKU_Code: '',
      Name: '',
      Description: '',
      Category: '',
      Item_Type: 'PRODUCT',

      Cost_Price: 0,
      Sale_Price: 0,
      Tax_Rate: 0.16,
      Final_Price: 0,

      Current_Stock: 0,
      Minimum_Stock: 0,

      Status: 1,
      Image: ''
    };

    this.errorMessage = '';
  }

  private validateForm(): boolean {
    if (
      !this.form.SKU_Code ||
      !this.form.Name ||
      !this.form.Category
    ) {
      this.errorMessage = 'Faltan campos obligatorios';
      return false;
    }

    if (
      this.form.Item_Type !== 'PRODUCT' &&
      this.form.Item_Type !== 'SERVICE'
    ) {
      this.errorMessage = 'El tipo debe ser PRODUCT o SERVICE';
      return false;
    }

    if (this.form.Sale_Price < 0 || this.form.Cost_Price < 0) {
      this.errorMessage = 'Los precios no pueden ser negativos';
      return false;
    }

    if (this.form.Item_Type === 'PRODUCT') {
      if (this.form.Current_Stock < 0 || this.form.Minimum_Stock < 0) {
        this.errorMessage = 'El stock no puede ser negativo';
        return false;
      }
    }

    return true;
  }

  private handleError(error: any): void {
    console.error(error);

    switch (error.status) {
      case 400:
        this.errorMessage =
          error.error?.message ||
          error.error?.error ||
          'Solicitud inválida';
        break;

      case 401:
        this.errorMessage = 'Acceso denegado. No se encontró token.';
        break;

      case 403:
        this.errorMessage = 'Token inválido o expirado.';
        break;

      case 404:
        this.errorMessage =
          error.error?.message || 'El registro no existe.';
        break;

      case 500:
        this.errorMessage = 'Error interno del servidor.';
        break;

      default:
        this.errorMessage = 'Ocurrió un error inesperado.';
        break;
    }
  }

  get isEditing(): boolean {
    return this.editingId !== null;
  }
}