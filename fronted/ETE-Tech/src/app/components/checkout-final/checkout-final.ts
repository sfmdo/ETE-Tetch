import { Component, Input, OnInit, ViewChild, ElementRef, inject, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaypalService } from '../../services/paypal.service';
import { OrderService } from '../../services/order.service';
import { firstValueFrom } from 'rxjs';

declare const paypal: any;

@Component({
  selector: 'app-checkout-final',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-final.html'
})
export class CheckoutFinalComponent implements OnInit {
  @Input() order: any; 
  @Output() paymentSuccess = new EventEmitter<void>();
  @Output() volverAtras = new EventEmitter<void>();

  @ViewChild('paypalButtonContainer', { static: true }) paypalButtonContainer!: ElementRef;

  private paypalService = inject(PaypalService);
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  mensajeStatus: string = '';
  cargando: boolean = false;

  ngOnInit(): void {
    if (this.order && this.order.Pending_Balance > 0) {
      this.renderPaypalButton();
    }
  }

  private renderPaypalButton(): void {
    paypal.Buttons({
      createOrder: async () => {
        try {
          const monto = Number(this.order.Pending_Balance);
          const response = await firstValueFrom(
            this.paypalService.crearOrden({
              items: [{ 
                nombre: `Liquidación Orden #${this.order.Order_Number}`, 
                cantidad: 1, 
                precio: monto 
              }],
              total: monto
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
        this.mensajeStatus = 'Procesando pago...';
        this.cdr.detectChanges();
        
        try {
          const capture = await firstValueFrom(this.paypalService.capturarOrden(data.orderID));
          if (capture.status === 'COMPLETED') {
            this.registrarAbonoFinal(Number(this.order.Pending_Balance));
          }
        } catch (error) {
          this.cargando = false;
          this.mensajeStatus = 'Error al capturar el pago.';
          this.cdr.detectChanges();
        }
      },
      onError: () => {
        this.mensajeStatus = 'Hubo un problema con la plataforma de pago.';
        this.cdr.detectChanges();
      }
    }).render(this.paypalButtonContainer.nativeElement);
  }

  private registrarAbonoFinal(monto: number): void {
  this.mensajeStatus = 'Pago aprobado. Registrando abono...';
  this.cdr.detectChanges();

  this.orderService.registerPayment(this.order.Order_ID, { amount: monto }).subscribe({
    next: () => {
      this.mensajeStatus = 'Abono registrado. Actualizando estado de la orden...';
      this.cdr.detectChanges();

      this.orderService.updateStatus(this.order.Order_ID, { status: 'PAID' }).subscribe({
        next: () => {
          // Éxito total
          this.mensajeStatus = '¡Orden liquidada y marcada como PAGADA con éxito!';
          this.cargando = false;
          this.cdr.detectChanges();
          setTimeout(() => this.paymentSuccess.emit(), 2000);
        },
        error: (err) => {
          console.error('Error al actualizar estatus:', err);
          this.mensajeStatus = 'Pago recibido, pero hubo un error al actualizar el estado a PAID.';
          this.cargando = false;
          this.cdr.detectChanges();
          setTimeout(() => this.paymentSuccess.emit(), 3000);
        }
      });
    },
    error: (err) => {
      console.error('Error al registrar abono:', err);
      this.mensajeStatus = 'Error crítico: Pago cobrado en PayPal pero no registrado en sistema.';
      this.cargando = false;
      this.cdr.detectChanges();
    }
  });
}
}