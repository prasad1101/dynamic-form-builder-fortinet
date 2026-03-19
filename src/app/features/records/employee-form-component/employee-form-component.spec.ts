import { TestBed } from '@angular/core/testing';
import { EmployeeFormComponent } from './employee-form-component';
import { FormStoreService } from '../../../core/services/form-store-service';
import { SnackbarService } from '../../../core/services/snackbar-service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EmployeeFormComponent', () => {

  let component: EmployeeFormComponent;

  let mockStore: any;
  let mockSnackbar: any;
  let mockRouter: any;
  let mockRoute: any;

  const fields = [
    { key: 'name', required: true, type: 'text' },
    { key: 'email', type: 'email' }
  ];

  beforeEach(async () => {

    mockStore = {
      fields$: new BehaviorSubject(fields),
      getRecordById: vi.fn(),
      addRecord: vi.fn(),
      updateRecord: vi.fn(),
      getDraft: vi.fn(),
      saveDraft: vi.fn(),
      clearDraft: vi.fn()
    };

    mockSnackbar = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn()
    };

    mockRouter = {
      navigate: vi.fn()
    };

    mockRoute = {
      snapshot: {
        paramMap: {
          get: vi.fn()
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [EmployeeFormComponent],
      providers: [
        { provide: FormStoreService, useValue: mockStore },
        { provide: SnackbarService, useValue: mockSnackbar },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    TestBed.overrideComponent(EmployeeFormComponent, {
      set: { template: `<div></div>` }
    });

    await TestBed.compileComponents();
  });

  function initComponent() {
    const fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  }

  it('should create component', () => {
    initComponent();
    expect(component).toBeTruthy();
  });

  it('should build form from fields', () => {
    initComponent();
    expect(component.form.contains('name')).toBe(true);
    expect(component.form.contains('email')).toBe(true);
  });

  it('should go into edit mode when id is present', () => {
    mockRoute.snapshot.paramMap.get.mockReturnValue('123');
    mockStore.getRecordById.mockReturnValue({ id: '123', name: 'John' });

    initComponent();

    expect(component.isEditMode).toBe(true);
    expect(component.form.value.name).toBe('John');
  });

  it('should redirect if record not found in edit mode', () => {
    mockRoute.snapshot.paramMap.get.mockReturnValue('123');
    mockStore.getRecordById.mockReturnValue(null);

    initComponent();

    expect(mockSnackbar.error).toHaveBeenCalledWith('Record not found');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/records']);
  });

  it('should restore draft if user confirms', () => {
    mockStore.getDraft.mockReturnValue({ name: 'Draft Name' });

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    initComponent();

    expect(component.form.value.name).toBe('Draft Name');
    expect(mockSnackbar.info).toHaveBeenCalledWith('Draft restored');
  });

  it('should clear draft if user cancels restore', () => {
    mockStore.getDraft.mockReturnValue({ name: 'Draft Name' });

    vi.spyOn(window, 'confirm').mockReturnValue(false);

    initComponent();

    expect(mockStore.clearDraft).toHaveBeenCalled();
  });

  it('should show warning if form is invalid on submit', () => {
    initComponent();

    component.submit();

    expect(mockSnackbar.warning).toHaveBeenCalledWith('Please fill all required fields');
  });

  it('should create new record on submit (create mode)', () => {
    initComponent();

    component.form.patchValue({ name: 'John', email: 'john@test.com' });

    component.submit();

    expect(mockStore.addRecord).toHaveBeenCalled();
    expect(mockStore.clearDraft).toHaveBeenCalled();
    expect(mockSnackbar.success).toHaveBeenCalledWith('Record saved successfully');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/records']);
  });

  it('should update record on submit (edit mode)', () => {
    mockRoute.snapshot.paramMap.get.mockReturnValue('123');
    mockStore.getRecordById.mockReturnValue({ id: '123', name: 'Old' });

    initComponent();

    component.form.patchValue({ name: 'Updated' });

    component.submit();

    expect(mockStore.updateRecord).toHaveBeenCalledWith({
      id: '123',
      name: 'Updated',
      email: ''
    });

    expect(mockSnackbar.success).toHaveBeenCalledWith('Record updated successfully');
  });

  it('should navigate on cancel', () => {
    initComponent();

    component.onCancel();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/records']);
  });

});