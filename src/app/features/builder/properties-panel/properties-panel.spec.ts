import { beforeEach, describe, it, expect, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { PropertiesPanelComponent } from './properties-panel';
import { FormStoreService } from '../../../core/services/form-store';
import { SnackbarService } from '../../../core/services/snackbar-service';
import { FieldConfig } from '../../../core/models/field.model';

describe('PropertiesPanelComponent', () => {
  let component: PropertiesPanelComponent;
  let fixture: ComponentFixture<PropertiesPanelComponent>;
  let mockStore: any;
  let mockSnackbar: any;

  beforeEach(async () => {
    // Mock dependencies
    mockStore = {
      selectedField$: {
        subscribe: vi.fn((fn: any) => {
          // No selected field initially
          fn(null);
        }),
      },
      saveField: vi.fn(),
      deleteField: vi.fn(),
    };

    mockSnackbar = {
      success: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PropertiesPanelComponent, FormsModule],
      providers: [
        { provide: FormStoreService, useValue: mockStore },
        { provide: SnackbarService, useValue: mockSnackbar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should clear form if no field is selected', () => {
    expect(component.fieldId).toBeNull();
    expect(component.fieldTitle).toBe('');
    expect(component.fieldType).toBe('Text Field');
    expect(component.required).toBe(false);
  });

  it('should apply field and call store.saveField + snackbar.success', () => {
    component.fieldTitle = 'Test Field';
    component.fieldType = 'text';
    component.required = true;

    component.applyField();

    expect(mockStore.saveField).toHaveBeenCalled();
    const savedField: FieldConfig = mockStore.saveField.mock.calls[0][0];
    expect(savedField.title).toBe('Test Field');
    expect(savedField.key).toBe('testfield');
    expect(savedField.type).toBe('text');
    expect(savedField.required).toBe(true);

    expect(mockSnackbar.success).toHaveBeenCalledWith('Field saved');
  });

  it('should warn if applying field with empty title', () => {
    component.fieldTitle = '  ';
    component.applyField();

    expect(mockSnackbar.warning).toHaveBeenCalledWith('Field title is required');
    expect(mockStore.saveField).not.toHaveBeenCalled();
  });

  it('should remove field when fieldId exists', () => {
    component.fieldId = '123';
    component.removeField();

    expect(mockStore.deleteField).toHaveBeenCalledWith('123');
    expect(mockSnackbar.success).toHaveBeenCalledWith('Field removed');
    expect(component.fieldId).toBeNull();
    expect(component.fieldTitle).toBe('');
  });

  it('should warn when removing field without fieldId', () => {
    component.fieldId = null;
    component.removeField();

    expect(mockSnackbar.warning).toHaveBeenCalledWith('No field selected');
    expect(mockStore.deleteField).not.toHaveBeenCalled();
  });

  it('should revert field to originalField', () => {
    component.originalField = {
      id: '1',
      title: 'Original',
      type: 'Number Field',
      required: true,
    };

    component.fieldTitle = 'Changed';
    component.revertField();

    expect(component.fieldTitle).toBe('Original');
    expect(component.fieldType).toBe('Number Field');
    expect(component.required).toBe(true);
    expect(mockSnackbar.info).toHaveBeenCalledWith('Changes reverted');
  });

  it('should clear form if no originalField when reverting', () => {
    component.originalField = null;
    component.fieldTitle = 'Something';
    component.revertField();

    expect(component.fieldTitle).toBe('');
    expect(component.fieldId).toBeNull();
    expect(component.fieldType).toBe('Text Field');
    expect(component.required).toBe(false);
  });
});