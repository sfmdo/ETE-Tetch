import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatus } from '../../../models/order.model';

@Component({
  selector: 'app-logistic-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logistic-status.html',
  styleUrls: ['./logistic-status.css']
})
export class LogisticStatusComponent {
  @Input() currentStatus!: OrderStatus;
  @Output() statusChanged = new EventEmitter<OrderStatus>();

  selectableOptions: OrderStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

  statusTranslation: Record<OrderStatus, string> = {
    'PENDING': 'Pendiente',
    'IN_PROGRESS': 'En Curso',
    'COMPLETED': 'Completado',
    'PAID': 'Pagado',
    'CANCELLED': 'Cancelado'
  };

  isEditable(): boolean {
    return this.selectableOptions.includes(this.currentStatus);
  }

  getStepState(targetStatus: OrderStatus): 'active' | 'completed' | 'pending' {
    const flow: OrderStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'PAID'];
    
    if (this.currentStatus === 'CANCELLED') return 'pending';

    const currentIndex = flow.indexOf(this.currentStatus);
    const targetIndex = flow.indexOf(targetStatus);

    if (targetIndex < currentIndex) {
      return 'completed';
    } else if (targetIndex === currentIndex) {
      return 'active';
    } else {
      return 'pending';
    }
  }

  onStatusChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value as OrderStatus;

    if (newStatus !== this.currentStatus) {
      if (confirm(`¿Cambiar estado logístico a ${this.statusTranslation[newStatus]}?`)) {
        this.statusChanged.emit(newStatus);
      } else {
        selectElement.value = this.currentStatus;
      }
    }
  }
}