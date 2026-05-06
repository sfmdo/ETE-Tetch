import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-pickup-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crm.html'
})
export class CRMComponent implements OnInit {
  allOrders: any[] = [];      
  filteredOrders: any[] = [];  
  searchTerm: string = '';
  loading: boolean = true;

  constructor(private orderService: OrderService,
              private cdr: ChangeDetectorRef,
              private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.cargarYFiltrarOrdenes();
  }

  cargarYFiltrarOrdenes(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.allOrders = data;
        console.log(this.allOrders);
        this.aplicarFiltros();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener órdenes:', err);
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
  const term = this.searchTerm.toLowerCase().trim();
  
  this.filteredOrders = this.allOrders.filter(order => {
    const esCompletada = order.Logistics_Status === 'COMPLETED';

    const orderNumStr = String(order.Order_Number || "").toLowerCase();
    const clientNameStr = String(order.Client_Name || "").toLowerCase();

    const coincideBusqueda = 
      orderNumStr.includes(term) || 
      clientNameStr.includes(term);

    return esCompletada && coincideBusqueda;
  });
    console.log('Órdenes filtradas:', this.filteredOrders.length);
  }

  notificarCliente(order: any): void {
  
  this.emailService.enviarNotificacionRecoleccion(order).subscribe({
    next: (res) => {
      console.log('Respuesta del servidor:', res);
      alert(`¡Aviso enviado con éxito a ${order.Client_Name}!`);
    },
    error: (err) => {
      console.error('Error al enviar notificación:', err);
      alert('No se pudo enviar el correo. Verifica la conexión con el servidor.');
    }
  });
}
}