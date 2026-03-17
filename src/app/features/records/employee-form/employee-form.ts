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

import { FormStoreService } from '../../../core/services/form-store';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.html'
})
export class EmployeeFormComponent {

  private fb = inject(FormBuilder);
  private store = inject(FormStoreService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup = this.fb.group({});
  fields: any[] = [];

  isSubmitting = false;

  // edit mode
  isEditMode = false;
  editRecord: any = null;

  ngOnInit() {

    // -------------------------------
    // ONLY ROUTE PARAM BASED EDIT
    // -------------------------------
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;

      // fetch record from store
      this.editRecord = this.store.getRecordById(id);

      // handle invalid id
      if (!this.editRecord) {
        alert('Record not found');
        this.router.navigate(['/records']);
        return;
      }
    }

    // -------------------------------
    // BUILD FORM
    // -------------------------------
    this.store.fields$.subscribe(fields => {

      this.fields = fields;

      const group: any = {};

      fields.forEach(field => {

        const validators: ValidatorFn[] = [];

        // required validation
        if (field.required) {
          validators.push(Validators.required);
        }

        // numeric validations
        if (field.min !== undefined) {
          validators.push(Validators.min(field.min));
        }

        if (field.max !== undefined) {
          validators.push(Validators.max(field.max));
        }

        // text validations
        if (field.minLength) {
          validators.push(Validators.minLength(field.minLength));
        }

        if (field.maxLength) {
          validators.push(Validators.maxLength(field.maxLength));
        }

        // type-based validations
        const typeValidators: Record<string, ValidatorFn[]> = {
          email: [Validators.email],
          phone: [Validators.pattern(/^[6-9]\d{9}$/)],
          url: [Validators.pattern(/https?:\/\/.+/)]
        };

        if (typeValidators[field.type]) {
          validators.push(...typeValidators[field.type]);
        }

        // custom pattern
        if (field.pattern) {
          validators.push(Validators.pattern(field.pattern));
        }

        // assign control
        group[field.key] = [
          field.defaultValue ?? '',
          validators
        ];
      });

      this.form = this.fb.group(group);

      // -------------------------------
      // PATCH DATA IN EDIT MODE
      // -------------------------------
      if (this.isEditMode && this.editRecord) {
        this.form.patchValue(this.editRecord);
      }

    });

  }

  submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // -------------------------------
    // UPDATE
    // -------------------------------
    if (this.isEditMode) {

      const updatedRecord = {
        ...this.editRecord,
        ...this.form.value
      };

      this.store.updateRecord(updatedRecord);

      alert('Record updated successfully');
    }

    // -------------------------------
    // CREATE
    // -------------------------------
    else {

      const record = {
        id: crypto.randomUUID(),
        ...this.form.value
      };

      this.store.addRecord(record);

      alert('Record saved successfully');
    }

    this.isSubmitting = false;

    // go back to records page
    this.router.navigate(['/records']);
  }

  /*
    Cancel action should take user back to records page.
    We do not reset form here because user is leaving the screen.
  */
  onCancel() {
    this.router.navigate(['/records']);
  }

}