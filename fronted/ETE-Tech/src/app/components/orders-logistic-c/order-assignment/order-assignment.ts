import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-assignment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-assignment.html',
  styleUrls: ['./order-assignment.css']
})
export class OrderAssignmentComponent {
  @Input() currentTechnician: number | undefined | null;
  @Input() currentTechnicianName: string | null = null;
  
  @Output() assignToMe = new EventEmitter<void>();

  onAssignClick(): void {
    this.assignToMe.emit();
  }
}