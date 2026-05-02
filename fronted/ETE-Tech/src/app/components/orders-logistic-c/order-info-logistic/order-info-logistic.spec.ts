import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderInfoLogistic } from './order-info-logistic';

describe('OrderInfoLogistic', () => {
  let component: OrderInfoLogistic;
  let fixture: ComponentFixture<OrderInfoLogistic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderInfoLogistic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderInfoLogistic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
