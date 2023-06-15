import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenShopComponent } from './open-shop.component';

describe('OpenShopComponent', () => {
  let component: OpenShopComponent;
  let fixture: ComponentFixture<OpenShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenShopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
