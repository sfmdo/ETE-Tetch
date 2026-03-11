import { TestBed } from '@angular/core/testing';

import { DetalleVenta } from './detalle-venta';

describe('DetalleVenta', () => {
  let service: DetalleVenta;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleVenta);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
