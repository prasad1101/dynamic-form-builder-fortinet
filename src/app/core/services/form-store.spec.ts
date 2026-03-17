import { TestBed } from '@angular/core/testing';

import { FormStore } from './form-store';

describe('FormStore', () => {
  let service: FormStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
