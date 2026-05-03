import { Component, Input, OnInit, ViewChild, ElementRef, inject, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaypalService } from '../../services/paypal.service'; // Revisa tu ruta
import { OrderService } from '../../services/order.service';   // Revisa tu ruta
import { CreateOrderPayload } from '../../models/order.model';
import { firstValueFrom } from 'rxjs';

declare const paypal: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.html'
})
export class CheckoutComponent implements OnInit {
  @Input() product: any; // Recibe Sale_Price, Name, Product_ID
  @Input() formValues: any; // Recibe brand, model, faultDescription
  @Input() currentUserId!: number;

  @Output() orderCreated = new EventEmitter<any>();
  @Output() volverAtras = new EventEmitter<void>();

  @ViewChild('paypalButtonContainer', { static: true }) paypalButtonContainer!: ElementRef;

  private paypalService = inject(PaypalService);
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  mensajeStatus: string = '';
  cargando: boolean = false;

  ngOnInit(): void {
    if (this.product) {
      this.renderPaypalButton();
    }
  }

  private renderPaypalButton(): void {
    paypal.Buttons({
      createOrder: async () => {
        try {
          const precio = Number(this.product.Final_Price);
          const response = await firstValueFrom(
            this.paypalService.crearOrden({
              items: [{ nombre: this.product.Name, cantidad: 1, precio: precio }],
              total: precio
            })
          );
          return response.id;
        } catch (error) {
          this.mensajeStatus = 'Error al conectar con PayPal.';
          this.cdr.detectChanges();
          throw error;
        }
      },
      onApprove: async (data: any) => {
        this.cargando = true;
        this.mensajeStatus = 'Procesando pago... no cierres la ventana.';
        this.cdr.detectChanges();
        
        try {
          const capture = await firstValueFrom(this.paypalService.capturarOrden(data.orderID));
          if (capture.status === 'COMPLETED') {
            this.mensajeStatus = 'Pago exitoso. Creando tu orden...';
            const montoPagado = Number(this.product.Final_Price);
            this.cdr.detectChanges();
            this.crearOrdenBackend(montoPagado);
          }
        } catch (error) {
          this.cargando = false;
          this.mensajeStatus = 'Ocurrió un error al procesar el pago.';
          this.cdr.detectChanges();
        }
      },
      onError: (err: any) => {
        this.mensajeStatus = 'Hubo un problema con PayPal.';
        this.cdr.detectChanges();
      }
    }).render(this.paypalButtonContainer.nativeElement);
  }

  private crearOrdenBackend(montoPagado: number): void {
  const payload: CreateOrderPayload = {
    Client_ID: this.currentUserId,
    Service_ID: this.product.Product_ID,
    Brand_Model: `${this.formValues.brand} ${this.formValues.model}`.trim(),
    Reported_Fault: this.formValues.faultDescription || 'N/A'
  };

  this.orderService.createOrder(payload).subscribe({
    next: (res: any) => {
      const nuevaOrderId = res.summary.orderId;

      setTimeout(() => {
      this.orderService.registerPayment(nuevaOrderId, { amount: montoPagado }).subscribe({
        next: (resPago) => {
          this.mensajeStatus = `¡Orden #${res.summary.orderNumber} creada y pagada con éxito!`;
          this.cargando = false;
          this.cdr.detectChanges();
          this.orderCreated.emit(res);
        },
        error: (err) => {
          console.error('Error al aplicar el abono:', err);
          this.mensajeStatus = 'Orden creada, pero falló el registro del abono.';
          this.cargando = false;
          this.cdr.detectChanges();
          this.orderCreated.emit(res); 
        }
      });
    }, 1000);
      
    },
    error: (err: any) => {
      this.cargando = false;
      const msg = err.error?.message || 'Error al guardar la orden';
      this.mensajeStatus = `Aviso: Pago cobrado, pero falló el registro: ${msg}`;
      this.cdr.detectChanges();
    }
  });
}
}