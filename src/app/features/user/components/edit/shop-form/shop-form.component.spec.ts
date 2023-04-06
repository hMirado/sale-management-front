import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopFormComponent } from './shop-form.component';

describe('ShopFormComponent', () => {
  let component: ShopFormComponent;
  let fixture: ComponentFixture<ShopFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
