import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerializationComponent } from './serialization.component';

describe('SerializationComponent', () => {
  let component: SerializationComponent;
  let fixture: ComponentFixture<SerializationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SerializationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerializationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
