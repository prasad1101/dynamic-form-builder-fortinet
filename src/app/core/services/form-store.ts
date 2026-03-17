import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FieldConfig, FieldType } from '../models/field.model';

/*
  This interface represents the builder state which includes:
  - all fields
  - selected field id
  - whether user is creating a new field
*/
interface BuilderState {
  fields: FieldConfig[];
  selectedFieldId: string | null;
  isNewField: boolean;
}

const STORAGE_KEY = 'builder-state';
const RECORDS_KEY = 'form-records';

@Injectable({ providedIn: 'root' })
export class FormStoreService {

  // -------------------------------
  // LOCAL STORAGE HELPERS
  // -------------------------------

  /*
    Generic method to safely read from localStorage.
    If parsing fails or data is missing, fallback is returned.
  */
  private getFromStorage<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  /*
    Generic method to write data to localStorage.
  */
  private setToStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // -------------------------------
  // INITIAL STATE
  // -------------------------------

  /*
    Load builder state once when service initializes.
  */
  private initialState: BuilderState = this.getFromStorage<BuilderState>(
    STORAGE_KEY,
    {
      fields: [],
      selectedFieldId: null,
      isNewField: false
    }
  );

  // -------------------------------
  // REACTIVE STATE (BehaviorSubjects)
  // -------------------------------

  private fieldsSubject = new BehaviorSubject<FieldConfig[]>(this.initialState.fields);
  fields$ = this.fieldsSubject.asObservable();

  private selectedFieldSubject = new BehaviorSubject<FieldConfig | null>(
    this.getSelectedField()
  );
  selectedField$ = this.selectedFieldSubject.asObservable();

  private isNewFieldSubject = new BehaviorSubject<boolean>(this.initialState.isNewField);
  isNewField$ = this.isNewFieldSubject.asObservable();

  private recordsSubject = new BehaviorSubject<any[]>(
    this.getFromStorage<any[]>(RECORDS_KEY, [])
  );
  records$ = this.recordsSubject.asObservable();

  // -------------------------------
  // GETTERS (SYNC ACCESS)
  // -------------------------------

  get fields() {
    return this.fieldsSubject.value;
  }

  get records() {
    return this.recordsSubject.value;
  }

  // -------------------------------
  // INTERNAL HELPERS
  // -------------------------------

  /*
    Finds selected field from initial state.
  */
  private getSelectedField(): FieldConfig | null {
    const { selectedFieldId, fields } = this.initialState;
    return fields.find(f => f.id === selectedFieldId) || null;
  }

  /*
    Save builder-related state to localStorage.
  */
  private persistBuilderState() {

    const selectedId = this.selectedFieldSubject.value?.id || null;

    const state: BuilderState = {
      fields: this.fields,
      selectedFieldId: this.fields.find(f => f.id === selectedId) ? selectedId : null,
      isNewField: this.isNewFieldSubject.value
    };

    this.setToStorage(STORAGE_KEY, state);
  }

  /*
    Save records separately from builder state.
  */
  private persistRecords() {
    this.setToStorage(RECORDS_KEY, this.records);
  }

  // -------------------------------
  // FIELD MANAGEMENT
  // -------------------------------

  /*
    Select an existing field for editing.
  */
  selectField(field: FieldConfig) {
    this.selectedFieldSubject.next({ ...field }); // clone to avoid mutation
    this.isNewFieldSubject.next(false);
    this.persistBuilderState();
  }

  /*
    Initialize a new field.
  */
  createNewField() {
    this.selectedFieldSubject.next({
      id: null as any,
      title: '',
      key: '',
      type: 'text' as FieldType,
      required: false
    });

    this.isNewFieldSubject.next(true);
    this.persistBuilderState();
  }

  /*
    Create or update a field.
  */
  saveField(field: FieldConfig) {

    if (!field.title?.trim()) {
      alert('Field title is required');
      return;
    }

    const index = this.fields.findIndex(f => f.id === field.id);

    let updatedFields: FieldConfig[];

    if (index === -1) {
      // create
      const newField: FieldConfig = {
        ...field,
        id: field.id || crypto.randomUUID()
      };

      updatedFields = [...this.fields, newField];
      this.selectedFieldSubject.next(newField);

    } else {
      // update
      updatedFields = this.fields.map(f =>
        f.id === field.id ? { ...f, ...field } : f
      );

      const updatedField = updatedFields.find(f => f.id === field.id)!;
      this.selectedFieldSubject.next(updatedField);
    }

    this.fieldsSubject.next(updatedFields);
    this.isNewFieldSubject.next(false);
    this.persistBuilderState();
  }

  /*
    Delete a field.
  */
  deleteField(id: string) {
    const updated = this.fields.filter(f => f.id !== id);

    this.fieldsSubject.next(updated);
    this.selectedFieldSubject.next(null);
    this.isNewFieldSubject.next(false);

    this.persistBuilderState();
  }

  /*
    Revert unsaved changes.
  */
  revert() {
    const selectedId = this.selectedFieldSubject.value?.id;
    if (!selectedId) return;

    const saved = this.fields.find(f => f.id === selectedId) || null;

    this.selectedFieldSubject.next(saved);
    this.isNewFieldSubject.next(false);
  }

  // -------------------------------
  // RECORD MANAGEMENT
  // -------------------------------

  /*
    Add new record.
  */
  addRecord(record: any) {
    const updated = [...this.records, record];
    this.recordsSubject.next(updated);
    this.persistRecords();
  }

  /*
    Get record by id (important for edit flow).
  */
  getRecordById(id: string) {
    return this.records.find(r => r.id === id) || null;
  }

  /*
    Update record safely.
  */
  updateRecord(updatedRecord: any) {

    const index = this.records.findIndex(r => r.id === updatedRecord.id);

    if (index === -1) {
      console.warn('Record not found for update');
      return;
    }

    const updated = [...this.records];
    updated[index] = updatedRecord;

    this.recordsSubject.next(updated);
    this.persistRecords();
  }

  /*
    Delete record.
  */
  deleteRecord(id: string) {
    const updated = this.records.filter(r => r.id !== id);
    this.recordsSubject.next(updated);
    this.persistRecords();
  }

  /*
    Replace all records (useful for API integration later).
  */
  setRecords(records: any[]) {
    this.recordsSubject.next(records);
    this.persistRecords();
  }

  /*
    Clear all records (useful for testing/reset).
  */
  clearRecords() {
    this.recordsSubject.next([]);
    this.persistRecords();
  }

}