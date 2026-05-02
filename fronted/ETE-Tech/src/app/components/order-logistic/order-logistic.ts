import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus, DiagnosisPayload } from '../../models/order.model';

import { LogisticStatusComponent } from '../orders-logistic-c/logistic-status/logistic-status';
import { PartsAssignmentComponent } from '../orders-logistic-c/parts-assignment/parts-assignment';
import { TechnicalRecordComponent } from '../orders-logistic-c/technical-record/technical-record';
import { OrderAssignmentComponent } from '../orders-logistic-c/order-assignment/order-assignment';
import { FinancialSummaryComponent } from '../orders-logistic-c/financial-summary/financial-summary';
import { OrderInfoLogisticComponent } from '../orders-logistic-c/order-info-logistic/order-info-logistic'

@Component({
  selector: 'app-order-logistic',
  standalone: true,
  imports: [
    CommonModule, 
    LogisticStatusComponent, 
    PartsAssignmentComponent, 
    TechnicalRecordComponent, 
    OrderAssignmentComponent, 
    FinancialSummaryComponent,
    OrderInfoLogisticComponent
  ],
  templateUrl: './order-logistic.html',
  styleUrls: ['./order-logistic.css']
})
export class OrderLogisticComponent implements OnInit {
  order: Order | null = null;
  loading: boolean = true;
  loggedUserId: number | null = null; 
  Technician_Name?: string | null = '';
  Technician_ID?: number | null = null;
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.loggedUserId = JSON.parse(userString).User_ID; 
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
        this.loading = false;
        this.Technician_ID = this.order?.Technician_ID;
        this.Technician_Name = this.order?.Technician_Name;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error cargando los detalles:', err);
        this.loading = false;
      }
    });
  }

  // --- MANEJADORES DE EVENTOS DE LOS COMPONENTES HIJOS ---

  onStatusChange(newStatus: OrderStatus): void {
    if (!this.order) return;
    this.orderService.updateStatus(this.order.Order_ID, { status: newStatus }).subscribe({
      next: () => {
        this.order!.Logistics_Status = newStatus;        
        alert('Estado logístico actualizado con éxito.');
        this.cdr.detectChanges(); 
        
      },
      error: (err) => {
        console.error('Error al actualizar en BD:', err);
        alert('Hubo un error al actualizar el estado.');
      }
    });
  }

  onSaveDiagnosis(payload: DiagnosisPayload): void {
  if (!this.order) return;
  if (!payload.Final_Diagnosis || !payload.Applied_Solution || !payload.Technician_ID) {
    alert('Por favor, completa el diagnóstico final, la solución aplicada y el asignamiento de la orden antes de guardar(En caso de solo asignar llene con un . o un espacio).');
    return
  }
  
  this.orderService.registerDiagnosis(this.order.Order_ID, payload).subscribe({
    next: () => {
      alert('Diagnóstico registrado correctamente');
      this.loadOrder(this.order!.Order_ID);
    },
    error: (err) => {
      if (err.status === 400 && err.error && err.error.message) {
        alert('Error del servidor: ' + err.error.message);
      } else {
        alert('Ocurrió un error inesperado al guardar el diagnóstico.');
      }
      
      console.error('Detalle del error:', err);
    }
  });
}

  onAssignToMe(): void {
    if (this.order && this.loggedUserId) {
      this.order.Technician_ID = this.loggedUserId;
      alert('Te has asignado a esta orden. Haz clic en "Guardar Cambios" para confirmar.');
    }
  }

  onPartsUpdated(): void {
    // Se llama cuando el hijo de refacciones agrega algo
    if (this.order) this.loadOrder(this.order.Order_ID);
  }
}