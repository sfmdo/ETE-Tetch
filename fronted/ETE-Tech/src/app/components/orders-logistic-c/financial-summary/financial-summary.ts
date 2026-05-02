import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './financial-summary.html',
  styleUrls: ['./financial-summary.css']
})
export class FinancialSummaryComponent {
  @Input() order!: Order | null;
}