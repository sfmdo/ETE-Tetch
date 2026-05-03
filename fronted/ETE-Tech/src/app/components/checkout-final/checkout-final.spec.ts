import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutFinal } from './checkout-final';

describe('CheckoutFinal', () => {
  let component: CheckoutFinal;
  let fixture: ComponentFixture<CheckoutFinal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutFinal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutFinal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
