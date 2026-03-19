import { TestBed } from '@angular/core/testing';
import { FormStoreService } from './form-store';

describe('FormStoreService', () => {
  let service: FormStoreService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(FormStoreService);
  });

  // basic creation
  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  // -------------------------------
  // FIELD MANAGEMENT
  // -------------------------------

  it('should create a new field', () => {
    service.createNewField();

    service.selectedField$.subscribe(field => {
      expect(field).toBeTruthy();
      expect(field?.id).toBeDefined();
    });

    service.isNewField$.subscribe(flag => {
      expect(flag).toBeTruthy();
    });
  });

  it('should save a new field', () => {
    const field = {
      id: '',
      title: 'Name',
      key: 'name',
      type: 'text',
      required: true
    } as any;

    service.saveField(field);

    expect(service.fields.length).toBe(1);
    expect(service.fields[0].title).toBe('Name');
  });

  it('should update an existing field', () => {
    const field = {
      id: '1',
      title: 'Name',
      key: 'name',
      type: 'text',
      required: false
    } as any;

    service.saveField(field);

    const updated = { ...field, title: 'Updated Name' };
    service.saveField(updated);

    expect(service.fields.length).toBe(1);
    expect(service.fields[0].title).toBe('Updated Name');
  });

  it('should delete a field', () => {
    const field = {
      id: '1',
      title: 'Name',
      key: 'name',
      type: 'text',
      required: false
    } as any;

    service.saveField(field);
    service.deleteField('1');

    expect(service.fields.length).toBe(0);
  });

  it('should select a field', () => {
    const field = {
      id: '1',
      title: 'Name',
      key: 'name',
      type: 'text',
      required: false
    } as any;

    service.saveField(field);
    service.selectField(field);

    service.selectedField$.subscribe(selected => {
      expect(selected?.id).toBe('1');
    });
  });

  it('should revert to saved field state', () => {
    const field = {
      id: '1',
      title: 'Name',
      key: 'name',
      type: 'text',
      required: false
    } as any;

    service.saveField(field);
    service.selectField(field);

    service.revert();

    service.selectedField$.subscribe(selected => {
      expect(selected?.id).toBe('1');
    });
  });

  // -------------------------------
  // RECORD MANAGEMENT
  // -------------------------------

  it('should add a record', () => {
    const record = { id: '1', name: 'John' };

    service.addRecord(record);

    expect(service.records.length).toBe(1);
  });

  it('should get record by id', () => {
    const record = { id: '1', name: 'John' };

    service.addRecord(record);

    const result = service.getRecordById('1');

    expect(result?.name).toBe('John');
  });

  it('should update a record', () => {
    const record = { id: '1', name: 'John' };

    service.addRecord(record);

    const updated = { id: '1', name: 'Updated' };
    service.updateRecord(updated);

    expect(service.records[0].name).toBe('Updated');
  });

  it('should delete a record', () => {
    const record = { id: '1', name: 'John' };

    service.addRecord(record);
    service.deleteRecord('1');

    expect(service.records.length).toBe(0);
  });

  it('should clear all records', () => {
    service.addRecord({ id: '1' });
    service.clearRecords();

    expect(service.records.length).toBe(0);
  });

  // -------------------------------
  // FIELD REORDER
  // -------------------------------

  it('should update fields order', () => {
    const fields = [
      { id: '1', title: 'A' },
      { id: '2', title: 'B' }
    ] as any;

    service.updateFields(fields);

    expect(service.fields[0].id).toBe('1');
  });

  // -------------------------------
  // DRAFT MANAGEMENT
  // -------------------------------

  it('should save and retrieve draft', () => {
    const draft = { name: 'Draft User' };

    service.saveDraft(draft);

    const result = service.getDraft();

    expect(result.name).toBe('Draft User');
  });

  it('should clear draft', () => {
    service.saveDraft({ name: 'Draft' });

    service.clearDraft();

    expect(service.getDraft()).toBeNull();
  });

});