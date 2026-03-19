import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormStoreService } from '../../../core/services/form-store';
import { FieldConfig, FieldType } from '../../../core/models/field.model';
import { SnackbarService } from '../../../core/services/snackbar-service';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './properties-panel.html'
})
export class PropertiesPanelComponent {

  private store = inject(FormStoreService);
  private snackbar = inject(SnackbarService);

  // Form state for currently selected field
  fieldId: string | null = null;
  fieldTitle = '';
  fieldType: FieldType = 'Text Field' as FieldType;
  required = false;

  // Keeps a copy of original field to support revert
  originalField: any = null;

  ngOnInit() {

    // Listen to selected field changes and populate form
    this.store.selectedField$.subscribe(field => {

      if (!field) {
        this.clearForm();
        return;
      }

      this.fieldId = field.id;
      this.fieldTitle = field.title;
      this.fieldType = field.type;
      this.required = field.required;

      // Store original state for revert action
      this.originalField = { ...field };

    });

  }

  // Create or update field based on current form state
  applyField() {

    if (!this.fieldTitle.trim()) {
      this.snackbar.warning('Field title is required');
      return;
    }

    // Generate key from title to be used in form data
    const key = this.fieldTitle
      .toLowerCase()
      .replace(/\s+/g, '');

    const field: FieldConfig = {
      id: this.fieldId || '',
      key,
      title: this.fieldTitle,
      type: this.fieldType,
      required: this.required
    };

    this.store.saveField(field);

    this.snackbar.success('Field saved');
  }

  // Remove selected field from store
  removeField() {

    if (!this.fieldId) {
      this.snackbar.warning('No field selected');
      return;
    }

    this.store.deleteField(this.fieldId);

    this.clearForm();

    this.snackbar.success('Field removed');
  }

  // Restore form values to original field state
  revertField() {

    if (!this.originalField) {
      this.clearForm();
      return;
    }

    this.fieldId = this.originalField.id;
    this.fieldTitle = this.originalField.title;
    this.fieldType = this.originalField.type;
    this.required = this.originalField.required;

    this.snackbar.info('Changes reverted');
  }

  // Reset form to initial empty state
  clearForm() {

    this.fieldId = null;
    this.fieldTitle = '';
    this.fieldType = 'Text Field' as FieldType;
    this.required = false;

  }

}