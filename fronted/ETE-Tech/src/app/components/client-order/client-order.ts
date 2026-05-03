import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { CheckoutFinalComponent } from '../checkout-final/checkout-final';

@Component({
  selector: 'app-client-order',
  standalone: true,
  imports: [CommonModule,CheckoutFinalComponent],
  templateUrl: './client-order.html',
  styleUrls: ['./client-order.css']
})
export class ClientOrderComponent implements OnInit {
  order: Order | null = null;
  loading: boolean = true;
  error: string = '';
  isCheckoutVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.cargarOrden(Number(idParam));
    } else {
      this.error = 'No se encontró el ID de la orden.';
      this.loading = false;
    }
  }

  cargarOrden(id: number): void {
    this.loading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (data: Order) => {
        this.order = data;
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al cargar la orden:', err);
        this.error = 'No se pudo cargar la información de la orden.';
        this.loading = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/user-dashboard']);
  }

  getProgressWidth(): string {
    if (!this.order) return '0%';
    switch (this.order.Logistics_Status) {
      case 'PENDING': return '25%';
      case 'IN_PROGRESS': return '50%';
      case 'COMPLETED': return '75%';
      case 'PAID': return '100%';
      default: return '0%';
    }
  }

  canPay(){
    return this.order?.Logistics_Status === 'COMPLETED' && +this.order.Pending_Balance > 0;
  }

  toggleCheckout(state: boolean): void {
    this.isCheckoutVisible = state;
  }


  onPaymentSuccess(): void {
    this.toggleCheckout(false); 
    if (this.order?.Order_ID) {
      this.cargarOrden(this.order.Order_ID);
      this.cdr.detectChanges();
    }
  }

  isStepActive(stepIndex: number): boolean {
    if (!this.order) return false;
    const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'PAID'];
    const currentIndex = statuses.indexOf(this.order.Logistics_Status);
    if (this.order.Logistics_Status === 'CANCELLED') return false;
    
    return stepIndex <= currentIndex;
  }
  
  translateStatus(status: string): string {
    switch (status) {
      case 'PENDING': return 'RECIBIDO';
      case 'IN_PROGRESS': return 'EN PROCESO';
      case 'COMPLETED': return 'COMPLETADO';
      case 'PAID': return 'PAGADO';
      case 'CANCELLED': return 'CANCELADO';
      default: return status;
    }
  }
}