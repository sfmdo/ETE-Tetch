import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CfdiXmlService } from '../../services/cfdi.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './factura.html',
  styleUrls: ['./factura.css']
})
export class FacturaComponent implements OnInit {
  @Input() order!: Order;
  @Output() close = new EventEmitter<void>();
  
  facturaForm!: FormGroup;

  // Catálogos SAT 2024
  regimenes = [
    { id: '601', text: '601 - General de Ley Personas Morales' },
    { id: '603', text: '603 - Personas Morales con Fines no Lucrativos' },
    { id: '605', text: '605 - Sueldos y Salarios' },
    { id: '612', text: '612 - Actividades Empresariales y Profesionales' },
    { id: '616', text: '616 - Sin obligaciones fiscales' },
    { id: '626', text: '626 - Régimen Simplificado de Confianza (RESICO)' }
  ];

  usosCFDI = [
    { id: 'G03', text: 'G03 - Gastos en general' },
    { id: 'S01', text: 'S01 - Sin efectos fiscales' },
    { id: 'I04', text: 'I04 - Equipo de cómputo y accesorios' },
    { id: 'CP01', text: 'CP01 - Pagos' }
  ];

  constructor(private fb: FormBuilder, private xmlService: CfdiXmlService) {}

  ngOnInit(): void {

    const savedUser = localStorage.getItem('user');
    let nombrePrecargado = '';

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        nombrePrecargado = userData.Full_Name ? userData.Full_Name.toUpperCase() : '';
      } catch (e) {
        console.error("Error al parsear el usuario del localStorage", e);
      }
    }

    this.facturaForm = this.fb.group({
      rfc: ['', [Validators.required, Validators.pattern(/^[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$/)]],
      nombre: [nombrePrecargado, [Validators.required, Validators.minLength(3)]],
      codigoPostal: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      regimenFiscal: ['616', Validators.required],
      usoCFDI: ['S01', Validators.required]
    });
  }

  generarXML(): void {
    if (this.facturaForm.valid) {
      const fiscalData = this.facturaForm.value;
      // Transformamos el nombre a MAYÚSCULAS (Requisito CFDI 4.0)
      fiscalData.nombre = fiscalData.nombre.toUpperCase();
      
      this.xmlService.generateInvoiceXml(this.order, fiscalData);
      this.close.emit();
    }
  }
}