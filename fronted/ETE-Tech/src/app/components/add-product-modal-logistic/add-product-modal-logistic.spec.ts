import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductModalLogistic } from './add-product-modal-logistic';

describe('AddProductModalLogistic', () => {
  let component: AddProductModalLogistic;
  let fixture: ComponentFixture<AddProductModalLogistic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductModalLogistic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductModalLogistic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
