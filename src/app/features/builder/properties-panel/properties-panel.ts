import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormStoreService } from '../../../core/services/form-store';
import { FieldConfig, FieldType } from '../../../core/models/field.model';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './properties-panel.html'
})
export class PropertiesPanelComponent {


  store = inject(FormStoreService);

  fieldId: string | null = null;
  fieldTitle = '';
  fieldType: FieldType = 'Text Field' as FieldType;
  required = false;

  originalField: any = null;

  ngOnInit() {

    this.store.selectedField$.subscribe(field => {

      if (!field) {
        this.clearForm();
        return;
      }

      this.fieldId = field.id;
      this.fieldTitle = field.title;
      this.fieldType = field.type;
      this.required = field.required;

      this.originalField = { ...field };

    });

  }

  applyField() {
    const key = this.fieldTitle
      .toLowerCase()
      .replace(/\s+/g, '') // "First Name" → "firstname"

    const field = {
      id: this.fieldId || '',
      key: key,
      title: this.fieldTitle,
      type: this.fieldType,
      required: this.required
    };

    this.store.saveField(field as FieldConfig);

  }

  removeField() {

    if (!this.fieldId) return;

    this.store.deleteField(this.fieldId);

    this.clearForm();

  }

  revertField() {

    if (!this.originalField) {
      this.clearForm();
      return;
    }

    this.fieldId = this.originalField.id;
    this.fieldTitle = this.originalField.title;
    this.fieldType = this.originalField.type;
    this.required = this.originalField.required;

  }

  clearForm() {

    this.fieldId = null;
    this.fieldTitle = '';
    this.fieldType = 'Text Field' as FieldType;
    this.required = false;

  }


}