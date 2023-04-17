import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDyanmicComponent } from './table-dyanmic.component';

describe('TableDyanmicComponent', () => {
  let component: TableDyanmicComponent;
  let fixture: ComponentFixture<TableDyanmicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableDyanmicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableDyanmicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
