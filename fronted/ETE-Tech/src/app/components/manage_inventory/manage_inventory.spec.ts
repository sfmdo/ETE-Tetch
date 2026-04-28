import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInventoryComponent } from './manage_inventory';

describe('Inventory', () => {
  let component: ManageInventoryComponent;
  let fixture: ComponentFixture<ManageInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageInventoryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});