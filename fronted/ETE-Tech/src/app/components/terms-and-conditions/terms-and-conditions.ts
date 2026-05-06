import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalService } from '../../services/legal.service'

@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './terms-and-conditions.html'
})
export class TermsAndConditionsComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  public termsAndConditions: string = '';
  constructor(private legalService: LegalService) { }

  

  ngOnInit(): void {

    this.termsAndConditions = this.legalService.getTermsAndConditions();
  }
  closeModal() {
    this.close.emit();
  }
}