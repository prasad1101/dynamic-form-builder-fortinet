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
const DRAFT_KEY = 'employee-form-draft';

@Injectable({ providedIn: 'root' })
export class FormStoreService {

  // -------------------------------
  // LOCAL STORAGE HELPERS
  // -------------------------------

  private getFromStorage<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setToStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // -------------------------------
  // INITIAL STATE
  // -------------------------------

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

  private getSelectedField(): FieldConfig | null {
    const { selectedFieldId, fields } = this.initialState;
    return fields.find(f => f.id === selectedFieldId) || null;
  }

  private persistBuilderState() {

    const selectedId = this.selectedFieldSubject.value?.id || null;

    const state: BuilderState = {
      fields: this.fields,
      selectedFieldId: this.fields.find(f => f.id === selectedId) ? selectedId : null,
      isNewField: this.isNewFieldSubject.value
    };

    this.setToStorage(STORAGE_KEY, state);
  }

  private persistRecords() {
    this.setToStorage(RECORDS_KEY, this.records);
  }

  // -------------------------------
  // FIELD MANAGEMENT
  // -------------------------------

  selectField(field: FieldConfig) {
    this.selectedFieldSubject.next({ ...field });
    this.isNewFieldSubject.next(false);
    this.persistBuilderState();
  }

  createNewField() {
    this.selectedFieldSubject.next({
      id: crypto.randomUUID(),
      title: '',
      key: '',
      type: 'text' as FieldType,
      required: false
    });

    this.isNewFieldSubject.next(true);
    this.persistBuilderState();
  }

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

  deleteField(id: string) {
    const updated = this.fields.filter(f => f.id !== id);

    this.fieldsSubject.next(updated);
    this.selectedFieldSubject.next(null);
    this.isNewFieldSubject.next(false);

    this.persistBuilderState();
  }

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

  addRecord(record: any) {
    const updated = [...this.records, record];
    this.recordsSubject.next(updated);
    this.persistRecords();
  }

  getRecordById(id: string) {
    return this.records.find(r => r.id === id) || null;
  }

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

  deleteRecord(id: string) {
    const updated = this.records.filter(r => r.id !== id);
    this.recordsSubject.next(updated);
    this.persistRecords();
  }

  setRecords(records: any[]) {
    this.recordsSubject.next(records);
    this.persistRecords();
  }

  clearRecords() {
    this.recordsSubject.next([]);
    this.persistRecords();
  }

  // -------------------------------
  // FIELD REORDER (FIXED)
  // -------------------------------

  updateFields(fields: FieldConfig[]) {
    this.fieldsSubject.next([...fields]); // keep original behavior

    const state: BuilderState = {
      fields: fields,
      selectedFieldId: this.selectedFieldSubject.value?.id || null,
      isNewField: this.isNewFieldSubject.value
    };

    this.setToStorage(STORAGE_KEY, state);
  }

  // -------------------------------
  // DRAFT MANAGEMENT
  // -------------------------------

  saveDraft(draft: any) {
    this.setToStorage(DRAFT_KEY, draft);
  }

  getDraft(): any {
    return this.getFromStorage<any>(DRAFT_KEY, null);
  }

  clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
  }

}