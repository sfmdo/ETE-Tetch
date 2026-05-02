import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { Product } from '../../../models/product.model';
import { AddItemsPayload } from '../../../models/order.model';

@Component({
  selector: 'app-add-product-modal-logistic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product-modal-logistic.html'
})
export class AddProductModalComponent implements OnInit {
  @Input() orderId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() productAdded = new EventEmitter<void>();

  errorMessage: string | null = null;
  
  products: Product[] = [];
  isLoadingProducts: boolean = true;
  isSaving: boolean = false;

  selectedProductId: number | null = null;
  selectedQuantity: number = 1;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoadingProducts = true;
    this.productService.getOnlyProducts().subscribe({
      next: (data: any) => {
        try {
          // Normalización de la respuesta de la API
          if (Array.isArray(data)) {
            this.products = data;
          } else if (data && Array.isArray(data.data)) {
            this.products = data.data;
          } else if (data && Array.isArray(data.products)) {
            this.products = data.products;
          }
          
          console.log('Productos cargados:', this.products.length);
        } catch (err) {
          console.error('Error procesando productos:', err);
        } finally {
          this.isLoadingProducts = false;
          this.cdr.detectChanges(); // Forzamos a la UI a reaccionar
        }
      },
      error: (err) => {
        console.error('Error de red/API:', err);
        this.isLoadingProducts = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveProduct(): void {
  // 1. Validación básica
  if (!this.orderId || !this.selectedProductId || this.selectedQuantity < 1) {
    console.error('Faltan datos en el modal:', { 
      orderId: this.orderId, 
      prod: this.selectedProductId, 
      qty: this.selectedQuantity 
    });
    return;
  }

  this.isSaving = true;
  this.cdr.detectChanges();

  // 2. Construcción del Payload con conversión EXPLÍCITA a Number
  const payload: AddItemsPayload = {
    Order_ID: Number(this.orderId), // Forzamos número
    items: [
      { 
        Product_ID: Number(this.selectedProductId), // Forzamos número
        Quantity: Number(this.selectedQuantity)     // Forzamos número
      }
    ]
  };

  // 3. Log para depuración (revisa esto en la consola antes de que falle)
  console.log('Enviando este payload a la API:', payload);

  this.orderService.addItems(payload).subscribe({
    next: (res) => {
      console.log('Respuesta éxito:', res);
      this.isSaving = false;
      this.cdr.detectChanges();
      this.productAdded.emit(); 
      this.close.emit();
    },
    error: (err) => {
      // 4. Si falla, mira el "err.error" para ver qué campo rechaza el backend
      console.error('Error detallado del servidor:', err.error);
      alert('Error al guardar: ' + (err.error?.message || 'Revisa los datos'));
      this.isSaving = false;
      this.cdr.detectChanges();
    }
  });
}

  onClose(): void {
    this.close.emit();
  }
}