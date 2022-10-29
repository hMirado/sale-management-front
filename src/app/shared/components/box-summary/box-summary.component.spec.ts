import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxSummaryComponent } from './box-summary.component';

describe('BoxSummaryComponent', () => {
  let component: BoxSummaryComponent;
  let fixture: ComponentFixture<BoxSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
