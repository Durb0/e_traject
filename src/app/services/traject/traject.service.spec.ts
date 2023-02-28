import { TestBed } from '@angular/core/testing';

import { TrajectService } from './traject.service';

describe('TrajectService', () => {
  let service: TrajectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrajectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
