import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderLogisticComponent } from './order-logistic';

describe('OrderLogistic', () => {
  let component: OrderLogisticComponent;
  let fixture: ComponentFixture<OrderLogisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderLogisticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderLogisticComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
