import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  ValidatorFn,
  FormGroup
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';

import { FormStoreService } from '../../../core/services/form-store-service';
import { SnackbarService } from '../../../core/services/snackbar-service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form-component.html'
})
export class EmployeeFormComponent {

  private fb = inject(FormBuilder);
  private store = inject(FormStoreService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackbar = inject(SnackbarService);

  form: FormGroup = this.fb.group({});
  fields: any[] = [];

  isSubmitting = false;

  // Used to determine whether we are editing an existing record
  isEditMode = false;
  editRecord: any = null;

  ngOnInit() {

    // Check if route contains an id, which means edit mode
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.editRecord = this.store.getRecordById(id);

      // If record is not found, notify and redirect
      if (!this.editRecord) {
        this.snackbar.error('Record not found');
        this.router.navigate(['/records']);
        return;
      }
    }

    // Subscribe to field configuration and build form dynamically
    this.store.fields$.subscribe(fields => {

      this.fields = fields;

      const group: any = {};

      fields.forEach(field => {

        const validators: ValidatorFn[] = [];

        // Basic validations based on field configuration
        if (field.required) validators.push(Validators.required);
        if (field.min !== undefined) validators.push(Validators.min(field.min));
        if (field.max !== undefined) validators.push(Validators.max(field.max));
        if (field.minLength) validators.push(Validators.minLength(field.minLength));
        if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));

        // Type-specific validations
        const typeValidators: Record<string, ValidatorFn[]> = {
          email: [Validators.email],
          phone: [Validators.pattern(/^[6-9]\d{9}$/)],
          url: [Validators.pattern(/https?:\/\/.+/)]
        };

        if (typeValidators[field.type]) {
          validators.push(...typeValidators[field.type]);
        }

        // Custom regex pattern if provided
        if (field.pattern) {
          validators.push(Validators.pattern(field.pattern));
        }

        group[field.key] = [
          field.defaultValue ?? '',
          validators
        ];
      });

      // Recreate form with latest field config
      this.form = this.fb.group(group);

      // Populate form in edit mode
      if (this.isEditMode && this.editRecord) {
        this.form.patchValue(this.editRecord);
      }
      // Otherwise try restoring saved draft
      else {
        const draft = this.store.getDraft();

        if (draft) {
          const shouldRestore = confirm('You have an unsaved draft. Restore it?');

          if (shouldRestore) {
            this.form.patchValue(draft);
            this.snackbar.info('Draft restored');
          } else {
            this.store.clearDraft();
          }
        }
      }

      // Auto-save draft while user types (only in create mode)
      this.form.valueChanges
        .pipe(debounceTime(500))
        .subscribe(value => {
          if (!this.isEditMode) {
            this.store.saveDraft(value);
          }
        });

    });

  }

  submit() {

    // Prevent submission if form is invalid
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackbar.warning('Please fill all required fields');
      return;
    }

    this.isSubmitting = true;

    if (this.isEditMode) {

      // Merge updated values with existing record
      const updatedRecord = {
        ...this.editRecord,
        ...this.form.value
      };

      this.store.updateRecord(updatedRecord);
      this.snackbar.success('Record updated successfully');

    } else {

      // Create new record with generated id
      const record = {
        id: crypto.randomUUID(),
        ...this.form.value
      };

      this.store.addRecord(record);

      // Clear saved draft once record is persisted
      this.store.clearDraft();

      this.snackbar.success('Record saved successfully');
    }

    this.isSubmitting = false;

    // Navigate back to records list
    this.router.navigate(['/records']);
  }

  onCancel() {
    this.router.navigate(['/records']);
  }

}