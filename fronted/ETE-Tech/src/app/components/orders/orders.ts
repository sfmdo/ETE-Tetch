import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.html',
  styleUrls: ['./orders.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  loading: boolean = false;
  currentFilter: string = 'Todas';

  stats = { pending: 0, inProgress: 0 };

  filterOptions = [
    { label: 'Todas las activas', value: 'Todas' },
    { label: 'Pendientes', value: 'PENDING' },
    { label: 'En Curso', value: 'IN_PROGRESS' },
    { label: 'Completadas', value: 'COMPLETED' },
    { label: 'Pagadas', value: 'PAID' }
  ];

  statusTranslation: any = {
    'PENDING': 'Pendiente',
    'IN_PROGRESS': 'En Curso',
    'COMPLETED': 'Completado',
    'PAID': 'Pagado',
    'CANCELLED': 'Cancelado'
  };

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.cdr.detectChanges(); // Forzamos mostrar el estado inicial de carga

    this.orderService.getAllOrders().subscribe({
      next: (data: any) => {
        // Validación de seguridad para la data
        const rawData = data && data.order ? data.order : (Array.isArray(data) ? data : []);
        this.orders = [...rawData];

        // Ejecutamos procesos internos
        this.calculateStats();
        this.applyFilter(this.currentFilter);

        // APAGADO SEGURO
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error crítico en API:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.currentFilter = filterValue;
    
    // Si no hay órdenes aún, no hacemos nada para no romper el código
    if (!this.orders || !Array.isArray(this.orders)) {
      this.filteredOrders = [];
      return;
    }

    if (filterValue === 'Todas') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(o => o && o.Logistics_Status === filterValue);
    }
    this.cdr.detectChanges();
  }

  calculateStats(): void {
    if (!this.orders || !Array.isArray(this.orders)) return;

    this.stats.pending = this.orders.filter(o => o?.Logistics_Status === 'PENDING').length;
    this.stats.inProgress = this.orders.filter(o => o?.Logistics_Status === 'IN_PROGRESS').length;
  }

  onSearch(event: any): void {
    const searchTerm = event.target.value?.toLowerCase();
    
    if (!searchTerm) {
      this.applyFilter(this.currentFilter);
      return;
    }

    this.filteredOrders = this.orders.filter(order => 
      order.Order_Number?.toLowerCase().includes(searchTerm) ||
      order.Brand_Model?.toLowerCase().includes(searchTerm) ||
      order.Client_ID?.toString().includes(searchTerm)
    );
    this.cdr.detectChanges();
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'PENDING': 'bg-tertiary-fixed-dim',
      'IN_PROGRESS': 'bg-primary',
      'COMPLETED': 'bg-[#1a8a3d]',
      'PAID': 'bg-secondary',
      'CANCELLED': 'bg-error'
    };
    return colors[status] || 'bg-outline';
  }
}