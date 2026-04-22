import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogComponent } from './catalog';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;


 // Mocks simplificados sin usar Jasmine directamente
  const mockProductService = {
    getOnlyServices: () => of([
      { id: 1, name: 'Reparación', type: 'SERVICE', price: 100 }
    ])
  };

  const mockOrderService = {
    createOrder: () => of({
      summary: { orderNumber: 'ORD-123' }
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: OrderService, useValue: mockOrderService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load services on init', () => {
    expect(component).toBeTruthy();
    expect(mockProductService.getOnlyServices).toHaveBeenCalled();
    expect(component.services.length).toBe(1);
  });
});