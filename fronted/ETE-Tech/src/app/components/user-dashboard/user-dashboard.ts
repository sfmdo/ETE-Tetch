import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true, 
  imports: [CommonModule,RouterLink],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboardComponent implements OnInit {
  userName: string = '';
  userId: number | null = null;

  activeOrders: Order[] = [];
  completedOrders: Order[] = [];
  pendingPayments: Order[] = [];

  cargando: boolean = true;
  error: string = '';

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.userName = user.Full_Name;
        this.userId = user.User_ID;
      } catch {
        this.userName = '';
      }
    }

    if (this.userId) {
      this.cargarOrdenes();
    } else {
      this.error = 'No se encontró sesión activa.';
      this.cargando = false;
    }
  }

  cargarOrdenes(): void {
    this.cargando = true;
    
    this.orderService.getClientOrders(this.userId!).subscribe({
      next: (ordenes: Order[]) => {
        this.activeOrders = ordenes.filter(o => 
          o.Logistics_Status !== 'COMPLETED' && o.Logistics_Status !== 'CANCELLED' && o.Logistics_Status !== 'PAID'
        );
        this.completedOrders = ordenes.filter(o => o.Logistics_Status === 'PAID');
        
        // Filtramos las que tienen saldo pendiente mayor a 0
        this.pendingPayments = ordenes.filter(o => Number(o.Pending_Balance) > 0 && o.Logistics_Status === 'COMPLETED');

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar dashboard:', err);
        this.error = 'Ocurrió un error al cargar tu información.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
  
  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-amber-400';
      case 'IN_PROGRESS': return 'bg-blue-500';
      case 'READY': return 'bg-green-400';
      case 'COMPLETED': return 'bg-green-600';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  }

  translateStatus(status: string): string {
    switch (status) {
      case 'PENDING': return 'RECIBIDO';
      case 'IN_PROGRESS': return 'EN PROCESO';
      case 'READY': return 'LISTO PARA ENTREGA';
      case 'COMPLETED': return 'COMPLETADO';
      case 'CANCELLED': return 'CANCELADO';
      case 'PAID': return 'PAGADO';
      default: return status;
    }
  }
}