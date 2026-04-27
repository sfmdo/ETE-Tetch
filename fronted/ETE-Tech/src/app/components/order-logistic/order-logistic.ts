import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus, DiagnosisPayload } from '../../models/order.model';
import { AddProductModalComponent } from '../add-product-modal-logistic/add-product-modal-logistic';

@Component({
  selector: 'app-order-logistic',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AddProductModalComponent],
  templateUrl: './order-logistic.html',
  styleUrls: ['./order-logistic.css']
})
export class OrderLogisticComponent implements OnInit {
  order: Order | null = null;
  loading: boolean = true;
  isProductModalOpen: boolean = false;
  loggedUserId: number | null = null; 

  diagnosisForm: DiagnosisPayload = {
    Technician_ID: 1, 
    Final_Diagnosis: '',
    Applied_Solution: ''
  };

  statusOptions: OrderStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'PAID', 'CANCELLED'];

  statusTranslation: Record<OrderStatus, string> = {
    'PENDING': 'Pendiente',
    'IN_PROGRESS': 'En Curso',
    'COMPLETED': 'Completado',
    'PAID': 'Pagado',
    'CANCELLED': 'Cancelado'
  };

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    
    if (userString) {
      const loggedUser = JSON.parse(userString);
      this.loggedUserId = loggedUser.User_ID; 
      this.diagnosisForm.Technician_ID = this.loggedUserId!; 
    } else {
      console.warn('No hay un usuario en sesión. El Técnico ID podría ser inválido.');
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOrder(+id);
    }
  }

  loadOrder(id: number): void {
    this.loading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (data: any) => {
        this.order = data.order || data;
        
        if (this.order) {
          this.diagnosisForm.Final_Diagnosis = this.order.Final_Diagnosis || '';
          this.diagnosisForm.Applied_Solution = this.order.Applied_Solution || '';
          
          // CORREGIDO: Usando Logistics_Status exactamente como viene en tu API y OrdersComponent
          console.log('Estado actual de la orden:', this.order.Logistics_Status);
        }

        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error cargando los detalles:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  assignToMe(): void {
    if (this.order && this.loggedUserId) {
      this.order.Technician_ID = this.loggedUserId;
      this.diagnosisForm.Technician_ID = this.loggedUserId;
      alert('Te has asignado a esta orden. Haz clic en "Guardar Cambios" para confirmar en el sistema.');
    }
  }

  saveDiagnosis(): void {
    if (!this.order) return;
    
    this.orderService.registerDiagnosis(this.order.Order_ID, this.diagnosisForm).subscribe({
      next: () => {
        alert('Diagnóstico registrado correctamente');
        this.loadOrder(this.order!.Order_ID);
      },
      error: (err) => {
        console.error('Error al guardar diagnóstico:', err);
        alert('Hubo un error al guardar.');
      }
    });
  }

  getStepState(targetStatus: OrderStatus): 'active' | 'completed' | 'pending' {
    if (!this.order) return 'pending';
    
    const flow: OrderStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'PAID'];
    
    // CORREGIDO: Logistics_Status
    const currentIndex = flow.indexOf(this.order.Logistics_Status);
    const targetIndex = flow.indexOf(targetStatus);

    // CORREGIDO: Logistics_Status
    if (this.order.Logistics_Status === 'CANCELLED') return 'pending';

    if (targetIndex < currentIndex) {
      return 'completed';
    } else if (targetIndex === currentIndex) {
      return 'active';
    } else {
      return 'pending';
    }
  }

  // Se dejó solo esta función (eliminé el updateStatus duplicado)
  onStatusChange(event: Event): void {
    if (!this.order) return;

    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value as OrderStatus;

    // CORREGIDO: Logistics_Status
    if (newStatus === this.order.Logistics_Status) return;

    if (confirm(`¿Cambiar estado logístico a ${this.statusTranslation[newStatus]}?`)) {
      
      this.orderService.updateStatus(this.order.Order_ID, { status: newStatus }).subscribe({
        next: () => {
          // CORREGIDO: Logistics_Status
          this.order!.Logistics_Status = newStatus; 
          this.cdr.detectChanges();       
          alert('Estado logístico actualizado con éxito en la base de datos.');
        },
        error: (err) => {
          console.error('Error al actualizar en BD:', err);
          alert('Hubo un error al actualizar el estado en el servidor.');
          // CORREGIDO: Logistics_Status
          selectElement.value = this.order!.Logistics_Status; 
        }
      });
      
    } else {
      // CORREGIDO: Logistics_Status
      selectElement.value = this.order.Logistics_Status;
    }
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'PENDING': 'bg-tertiary-fixed-dim text-primary',
      'IN_PROGRESS': 'bg-primary text-on-primary',
      'COMPLETED': 'bg-[#1a8a3d] text-white',
      'PAID': 'bg-secondary text-white',
      'CANCELLED': 'bg-error text-white'
    };
    return colors[status] || 'bg-surface-container-highest text-on-surface';
  }

  openProductModal(): void {
    this.isProductModalOpen = true;
  }

  closeProductModal(): void {
    this.isProductModalOpen = false;
  }

  onProductAdded(): void {
    alert('Refacción agregada con éxito');
    if (this.order) {
      this.loadOrder(this.order.Order_ID);
    }
  }
}