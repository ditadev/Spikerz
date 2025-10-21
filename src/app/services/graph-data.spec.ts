import { TestBed } from '@angular/core/testing';

import { GraphData } from './graph-data.service';

describe('GraphData', () => {
  let service: GraphData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
