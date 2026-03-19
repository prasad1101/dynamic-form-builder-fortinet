import { beforeEach, describe, it, expect, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { FieldsPanelComponent } from './fields-panel';
import { FormStoreService } from '../../../core/services/form-store';
import { SnackbarService } from '../../../core/services/snackbar-service';
import { FieldConfig, FieldType } from '../../../core/models/field.model';

describe('FieldsPanelComponent', () => {
  let component: FieldsPanelComponent;
  let fixture: ComponentFixture<FieldsPanelComponent>;
  let mockStore: any;
  let mockSnackbar: any;

  beforeEach(async () => {
    mockStore = {
      fields$: {
        subscribe: vi.fn((fn: any) => {
          // Provide some initial fields
          fn([
            { id: '1', key: 'field1', title: 'Field 1', type: 'Text Field', required: false },
            { id: '2', key: 'field2', title: 'Field 2', type: 'Text Field', required: true }
          ]);
        }),
      },
      selectField: vi.fn(),
      createNewField: vi.fn(),
      updateFields: vi.fn(),
    };

    mockSnackbar = {
      success: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FieldsPanelComponent],
      providers: [
        { provide: FormStoreService, useValue: mockStore },
        { provide: SnackbarService, useValue: mockSnackbar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize fields from store', () => {
    expect(component.fields.length).toBe(2);
    expect(component.fields[0].title).toBe('Field 1');
  });

  it('should call store.selectField when select() is called', () => {
    const field: FieldConfig = { id: '1', key: 'field1', title: 'Field 1', type: 'text' as FieldType, required: false };
    component.select(field);
    expect(mockStore.selectField).toHaveBeenCalledWith(field);
  });

  it('should call store.createNewField when addNew() is called', () => {
    component.addNew();
    expect(mockStore.createNewField).toHaveBeenCalled();
  });

  it('should reorder fields and update store when drop() is called', () => {
    // Initial order: Field 1, Field 2
    const event: CdkDragDrop<FieldConfig[]> = {
      previousIndex: 0,
      currentIndex: 1,
      container: null as any,
      previousContainer: null as any,
      isPointerOverContainer: true,
      item: null as any,
      distance: { x: 0, y: 0 },
      dropPoint: { x: 0, y: 0 },
      event: new MouseEvent('drop')
    };

    component.drop(event);

    // Fields array should be reordered
    expect(component.fields[0].id).toBe('2');
    expect(component.fields[1].id).toBe('1');

    // Store update should be called
    expect(mockStore.updateFields).toHaveBeenCalledWith(component.fields);

    // Snackbar should be shown
    expect(mockSnackbar.success).toHaveBeenCalledWith('Field order updated');
  });
});