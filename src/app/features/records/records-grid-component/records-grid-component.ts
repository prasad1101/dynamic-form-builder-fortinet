import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormStoreService } from '../../../core/services/form-store-service';
import { FieldConfig } from '../../../core/models/field.model';
import { Router } from '@angular/router';
import { CustomTableComponent } from '../../../shared/components/custom-table/custom-table';
import { SnackbarService } from '../../../core/services/snackbar-service';

@Component({
  selector: 'app-records-grid',
  standalone: true,
  imports: [CommonModule, CustomTableComponent],
  templateUrl: './records-grid-component.html'
})
export class RecordsGridComponent {

  private store = inject(FormStoreService);
  private router = inject(Router);
  private snackbar = inject(SnackbarService);

  // Table configuration derived from dynamic field definitions
  columns: FieldConfig[] = [];

  // Data source for the table
  data: any[] = [];

  // Keeps track of selected row ids for bulk actions
  selectedIds: string[] = [];

  ngOnInit() {

    // Keep columns in sync with field configuration
    this.store.fields$.subscribe(fields => {
      this.columns = fields;
    });

    // Keep table data in sync with stored records
    this.store.records$.subscribe(records => {
      this.data = records;
    });

  }

  // Called when table selection changes
  onSelectionChange(ids: string[]) {
    this.selectedIds = ids;
  }

  // Handles bulk delete triggered from table
  onDeleteSelected(ids: string[]) {

    if (!ids.length) {
      this.snackbar.warning('No records selected');
      return;
    }

    ids.forEach(id => this.store.deleteRecord(id));

    this.snackbar.success('Selected records deleted');
  }

  // Navigate to edit screen when a row is clicked
  onRowClick(row: any) {

    if (!row?.id) {
      this.snackbar.error('Invalid record');
      return;
    }

    this.router.navigate(['/edit', row.id]);
  }

}