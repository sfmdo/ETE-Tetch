import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service'; 
import { OrderService } from '../../services/order.service';     
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.css']
})
export class CatalogComponent implements OnInit {
  services: Product[] = [];
  selectedProduct: Product | null = null;
  receptionForm: FormGroup;
  showForm: boolean = false;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private fb: FormBuilder
  ) {
    this.receptionForm = this.fb.group({
      clientId: [10, Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      faultDescription: ['', Validators.required],
      passcode: ['']
    });
  }

  ngOnInit(): void {
    this.loadOnlyServices();
  }
loadOnlyServices(): void {
    this.productService.getOnlyServices().subscribe({
      next: (data) => {
        // Pon esta línea aquí para ver la verdad absoluta:
        console.log('LO QUE LLEGA DEL BACKEND ES:', data); 
        this.services = data;
      },
      error: (err) => console.error('Error cargando servicios:', err)
    });
  }
  selectProduct(product: Product): void {
    this.selectedProduct = product;

    // Ahora usamos exactamente tu propiedad Item_Type
    const isService = product.Item_Type === 'SERVICE';

    if (isService) {
      this.showForm = true;
      this.receptionForm.reset({ clientId: 10 }); 
    } else {
      this.showForm = false;
      this.generateDirectTicket(product);
    }
  }

  generateDirectTicket(product: Product): void {
    const payload = {
      Client_ID: 10,
      Service_ID: product.Product_ID!, // Ajustado a Product_ID
      Brand_Model: 'N/A (Venta Directa)',
      Reported_Fault: 'N/A'
    };

    this.submitToApi(payload);
  }

  onSubmitForm(): void {
    if (this.receptionForm.invalid || !this.selectedProduct) {
      this.receptionForm.markAllAsTouched();
      return;
    }

    const formValues = this.receptionForm.value;
    const payload = {
      Client_ID: formValues.clientId,
      Service_ID: this.selectedProduct.Product_ID!, // Ajustado a Product_ID
      Brand_Model: `${formValues.brand} ${formValues.model}`,
      Reported_Fault: formValues.faultDescription
    };

    this.submitToApi(payload);
  }

  private submitToApi(payload: any): void {
    this.orderService.createOrder(payload).subscribe({
      next: (res) => {
        console.log('Ticket generado con éxito:', res);
        alert(`Ticket Creado: ${res.summary.orderNumber}`);
        this.selectedProduct = null;
        this.showForm = false;
      },
      error: (err) => {
        console.error('Error al generar ticket:', err);
        alert('Hubo un error al crear la orden. Revisa la consola.');
      }
    });
  }

  cancelReception(): void {
    this.selectedProduct = null;
    this.showForm = false;
  }
}