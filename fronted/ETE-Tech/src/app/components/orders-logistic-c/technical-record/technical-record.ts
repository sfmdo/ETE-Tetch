import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiagnosisPayload } from '../../../models/order.model';

@Component({
  selector: 'app-technical-record',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './technical-record.html',
  styleUrls: ['./technical-record.css']
})
export class TechnicalRecordComponent implements OnInit, OnChanges {
  
  @Input() initialDiagnosis: string | undefined = '';
  @Input() initialSolution: string | undefined = '';
  @Input() technicianId!: number | null;

  
  @Output() saveDiagnosis = new EventEmitter<DiagnosisPayload>();

  
  diagnosisText: string = '';
  solutionText: string = '';

  ngOnInit(): void {
    this.syncData();
  }

  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialDiagnosis'] || changes['initialSolution']) {
      this.syncData();
    }
  }

  private syncData(): void {
    this.diagnosisText = this.initialDiagnosis || '';
    this.solutionText = this.initialSolution || '';
  }

  onSave(): void {
    if (!this.technicianId) {
      alert('Error: No puedes guardar un diagnóstico porque no hay un técnico en sesión o asignado.');
      return;
    }

    const payload: DiagnosisPayload = {
      Technician_ID: this.technicianId,
      Final_Diagnosis: this.diagnosisText,
      Applied_Solution: this.solutionText
    };

    this.saveDiagnosis.emit(payload);
  }
}