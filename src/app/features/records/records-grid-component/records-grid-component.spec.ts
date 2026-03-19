import { TestBed } from '@angular/core/testing';
import { RecordsGridComponent } from './records-grid-component';
import { FormStoreService } from '../../../core/services/form-store-service';
import { SnackbarService } from '../../../core/services/snackbar-service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RecordsGridComponent', () => {

  let component: RecordsGridComponent;

  let mockStore: any;
  let mockSnackbar: any;
  let mockRouter: any;

  beforeEach(async () => {

    mockStore = {
      fields$: new BehaviorSubject([]),
      records$: new BehaviorSubject([]),
      deleteRecord: vi.fn()
    };

    mockSnackbar = {
      success: vi.fn(),
      warning: vi.fn(),
      error: vi.fn()
    };

    mockRouter = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [RecordsGridComponent],
      providers: [
        { provide: FormStoreService, useValue: mockStore },
        { provide: SnackbarService, useValue: mockSnackbar },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    // override template to avoid templateUrl issue
    TestBed.overrideComponent(RecordsGridComponent, {
      set: { template: `<div></div>` }
    });

    await TestBed.compileComponents();

    const fixture = TestBed.createComponent(RecordsGridComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should update columns from store', () => {
    const fields = [{ id: '1', key: 'name', title: 'Name' }];

    mockStore.fields$.next(fields);

    expect(component.columns).toEqual(fields);
  });

  it('should update data from store', () => {
    const records = [{ id: '1', name: 'John' }];

    mockStore.records$.next(records);

    expect(component.data).toEqual(records);
  });

  it('should update selectedIds on selection change', () => {
    component.onSelectionChange(['1', '2']);

    expect(component.selectedIds).toEqual(['1', '2']);
  });

  it('should show warning if no ids selected for delete', () => {
    component.onDeleteSelected([]);

    expect(mockSnackbar.warning).toHaveBeenCalledWith('No records selected');
    expect(mockStore.deleteRecord).not.toHaveBeenCalled();
  });

  it('should delete selected records and show success', () => {
    component.onDeleteSelected(['1', '2']);

    expect(mockStore.deleteRecord).toHaveBeenCalledTimes(2);
    expect(mockStore.deleteRecord).toHaveBeenCalledWith('1');
    expect(mockStore.deleteRecord).toHaveBeenCalledWith('2');

    expect(mockSnackbar.success).toHaveBeenCalledWith('Selected records deleted');
  });

  it('should navigate to edit page on valid row click', () => {
    component.onRowClick({ id: '123' });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/edit', '123']);
  });

  it('should show error for invalid row click', () => {
    component.onRowClick({});

    expect(mockSnackbar.error).toHaveBeenCalledWith('Invalid record');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

});