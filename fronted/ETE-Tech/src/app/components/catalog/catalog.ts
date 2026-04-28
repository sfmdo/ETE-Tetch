import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service'; 
import { OrderService } from '../../services/order.service';
import { CreateOrderPayload, CreateOrderResponse } from '../../models/order.model';
import { Product } from '../../models/product.model';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';

// IMPORTANTE: Recuerda importar aquí tu CheckoutComponent
import { CheckoutComponent } from '../checkout/checkout';

@Component({
  selector: 'app-catalog',
  standalone: true,
  // Tienes que agregar CheckoutComponent a los imports para poder usar <app-checkout> en el HTML
  imports: [CommonModule, ReactiveFormsModule, CheckoutComponent], 
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.css']
})
export class CatalogComponent implements OnInit {
  services: Product[] = [];
  loading: boolean = false;
  selectedProduct: Product | null = null;
  receptionForm: FormGroup;
  currentUserId: number = 0; 
  brands: string[] = ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Motorola', 'Google', 'Oppo', 'Vivo', 'Sony', 'Asus', 'Lenovo', 'HP', 'Dell', 'Nintendo', 'PlayStation', 'Xbox', 'Otra'];
  
  showForm: boolean = false;
  
  // ¡AQUÍ ESTÁ LA VARIABLE FALTANTE! Debe ir a nivel de clase, no dentro del constructor
  mostrarCheckout: boolean = false; 

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.receptionForm = this.fb.group({
      clientId: [10, Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      faultDescription: ['', Validators.required],
      passcode: ['']
    });
    this.currentUserId = this.authService.getCurrentUser()?.User_ID || 0;
    
    // ELIMINÉ @ViewChild y paymentReady de aquí porque eran sintaxis inválida 
    // y de todas formas esa lógica ya se mudó al CheckoutComponent.
  }
  
  ngOnInit(): void {
    this.loadOnlyServices();
  }

  loadOnlyServices(): void {
    this.productService.getOnlyServices().subscribe({
      next: (data) => {
        this.services = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error cargando servicios:', err);
        this.cdr.detectChanges();
      }
    });
  }

  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.showForm = true;
    this.mostrarCheckout = false; // Nos aseguramos de empezar en el formulario

    const currentUserId = this.authService.getCurrentUserId();

    this.receptionForm.reset({
      clientId: currentUserId, 
      brand: '',
      model: '',
      faultDescription: '',
      aestheticStatus: 'Bueno'
    });

    const isService = product.Category === 'Servicio';
    const brandCtrl = this.receptionForm.get('brand');
    const modelCtrl = this.receptionForm.get('model');

    if (isService) {
      brandCtrl?.setValidators([Validators.required]);
      modelCtrl?.setValidators([Validators.required]);
    } else {
      brandCtrl?.clearValidators();
      modelCtrl?.clearValidators();
    }

    brandCtrl?.updateValueAndValidity();
    modelCtrl?.updateValueAndValidity();
    
    this.cdr.detectChanges(); 
  }

  isServiceCategory(): boolean {
    if (!this.selectedProduct) return false;
    const serviceCategories = ['Servicio'];
    return serviceCategories.includes(this.selectedProduct.Category);
  }

  generateDirectTicket(product: Product): void {
    const payload = {
      Client_ID: 10,
      Service_ID: product.Product_ID!, 
      Brand_Model: 'N/A (Venta Directa)',
      Reported_Fault: 'N/A'
    };

    this.submitToApi(payload);
  }

  // --- NUEVAS FUNCIONES PARA EL FLUJO DE PAGO ---

  onSubmitForm(): void {
    if (this.receptionForm.invalid) return;
    
    // Cambiamos a la vista de pago
    this.mostrarCheckout = true;
    this.cdr.detectChanges();
  }

  onFinalizarTodo(respuestaBackend: any): void {
    // Esto lo emite el CheckoutComponent cuando ya se pagó y se guardó en BD
    const numOrden = respuestaBackend.summary?.orderNumber || 'Desconocido';
    alert(`¡Orden #${numOrden} creada exitosamente!`);
    
    // Limpiamos la pantalla
    this.cancelReception();
  }

  // Se eliminó la función duplicada y se consolidó en esta
  cancelReception(): void {
    this.selectedProduct = null;
    this.showForm = false;
    this.mostrarCheckout = false; 
    this.receptionForm.reset();
    this.cdr.detectChanges();
  }

  private submitToApi(payload: any): void {
    this.orderService.createOrder(payload).subscribe({
      next: (res) => {
        console.log('Ticket generado con éxito:', res);
        alert(`Ticket Creado: ${res.summary.orderNumber}`);
        this.cancelReception();
      },
      error: (err) => {
        console.error('Error al generar ticket:', err);
        alert('Hubo un error al crear la orden. Revisa la consola.');
      }
    });
  }
}