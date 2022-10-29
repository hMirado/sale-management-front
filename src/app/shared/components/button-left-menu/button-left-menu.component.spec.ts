import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonLeftMenuComponent } from './button-left-menu.component';

describe('ButtonLeftMenuComponent', () => {
  let component: ButtonLeftMenuComponent;
  let fixture: ComponentFixture<ButtonLeftMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonLeftMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonLeftMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
