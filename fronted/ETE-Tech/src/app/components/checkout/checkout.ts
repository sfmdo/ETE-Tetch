import { Component, Signal, computed, inject, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CarritoService } from '../../service/carrito.service';
import { Product } from '../../models/product.model';
import { PaypalService } from '../../services/paypal.service';
import { Router } from '@angular/router';

declare var paypal: any;

interface CartItem extends Product {
  cantidad: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements AfterViewInit {
  private carritoService = inject(CarritoService);
  private paypalService = inject(PaypalService);
  private router = inject(Router);

  // Agrupamos los productos del carrito para manejar cantidades
  items = computed(() => {
    const list = this.carritoService.Lista();
    const map = new Map<number, CartItem>();
    
    list.forEach(p => {
      if (map.has(p.Product_ID)) {
        map.get(p.Product_ID)!.cantidad++;
      } else {
        map.set(p.Product_ID, { ...p, cantidad: 1 });
      }
    });
    
    return Array.from(map.values());
  });

  total = this.carritoService.total;
  successMessage: string = '';

  ngAfterViewInit() {
    this.renderPaypalButtons();
  }

  renderPaypalButtons() {
    if (typeof paypal !== 'undefined') {
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          const totalMonto = this.total();
          const itemsData = this.items().map(item => ({
            nombre: item.Name,
            precio: item.Final_Price ?? item.Sale_Price ?? 0,
            cantidad: item.cantidad
          }));

          return new Promise((resolve, reject) => {
            this.paypalService.crearOrden(itemsData, totalMonto).subscribe({
              next: (res) => resolve(res.id),
              error: (err) => {
                console.error('Error al crear orden en backend:', err);
                reject(err);
              }
            });
          });
        },
        onApprove: (data: any, actions: any) => {
          return new Promise((resolve, reject) => {
            this.paypalService.capturePago(data.orderID).subscribe({
              next: (res) => {
                console.log('Pago capturado con éxito:', res);
                this.successMessage = 'Compra Exitosa';
                this.carritoService.vaciarCarrito();
                
                // Redirigir después de 2 segundos para que vean el mensaje
                setTimeout(() => {
                  this.router.navigate(['/']);
                }, 2000);
                
                resolve(res);
              },
              error: (err) => {
                console.error('Error al capturar pago:', err);
                alert('Hubo un error al procesar el pago final');
                reject(err);
              }
            });
          });
        },
        onError: (err: any) => {
          console.error('PayPal Error:', err);
          alert('Ocurrió un error con el botón de PayPal');
        }
      }).render('#paypal-button-container');
    } else {
      console.error('PayPal SDK no cargado');
    }
  }
}
