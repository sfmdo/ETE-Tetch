import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddProductModalComponent } from '../add-product-modal-logistic/add-product-modal-logistic';

@Component({
  selector: 'app-parts-assignment',
  standalone: true,
  imports: [CommonModule, AddProductModalComponent],
  templateUrl: './parts-assignment.html',
  styleUrls: ['./parts-assignment.css']
})
export class PartsAssignmentComponent {
  @Input() orderId!: number;
  @Output() partsUpdated = new EventEmitter<void>();
  @Input() items: any[] = [];
  @Input() logisticStatus: string | undefined;

  isProductModalOpen: boolean = false;

  openProductModal(): void {
    this.isProductModalOpen = true;
  }

  closeProductModal(): void {
    this.isProductModalOpen = false;
  }

  onProductAdded(): void {
    this.closeProductModal();
    this.partsUpdated.emit();
  }

  get totalItems(): number {
    return this.items.reduce((acc, item) => acc + (item.Unit_Price * item.Quantity), 0);
  }
}