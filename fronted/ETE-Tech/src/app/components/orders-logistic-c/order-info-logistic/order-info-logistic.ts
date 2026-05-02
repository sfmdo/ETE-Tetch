import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-info-logistic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-info-logistic.html'
})
export class OrderInfoLogisticComponent {
  @Input() clientName: string = '';
  @Input() clientId: number | string = '';
  @Input() brandModel: string = '';
  @Input() reportedFault: string = '';
}