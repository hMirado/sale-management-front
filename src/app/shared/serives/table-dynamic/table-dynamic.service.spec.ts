import { TestBed } from '@angular/core/testing';

import { TableDynamicService } from './table-dynamic.service';

describe('TableDynamicService', () => {
  let service: TableDynamicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableDynamicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
