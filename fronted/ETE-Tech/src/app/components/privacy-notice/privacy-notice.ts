import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalService } from '../../services/legal.service'

@Component({
  selector: 'app-privacy-notice',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './privacy-notice.html'
})
export class PrivacyNoticeComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  public privacyContent: string = '';
  constructor(private legalService: LegalService) { }

  

  ngOnInit(): void {

    this.privacyContent = this.legalService.getTermsAndConditions();
  }
  closeModal() {
    this.close.emit();
  }
}