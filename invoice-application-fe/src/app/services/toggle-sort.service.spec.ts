import { TestBed } from '@angular/core/testing';

import { ToggleSortService } from './toggle-sort.service';

describe('ToggleSortService', () => {
  let service: ToggleSortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToggleSortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
