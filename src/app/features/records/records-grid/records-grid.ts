import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormStoreService } from '../../../core/services/form-store';
import { FieldConfig } from '../../../core/models/field.model';
import { CustomTableComponent } from '../../../core/shared/components/custom-table/custom-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-records-grid',
  standalone: true,
  imports: [CommonModule, CustomTableComponent],
  templateUrl: './records-grid.html'
})
export class RecordsGridComponent {

  private store = inject(FormStoreService);
  private router = inject(Router);

  columns: FieldConfig[] = [];
  data: any[] = [];

  selectedIds: string[] = [];

  ngOnInit() {

    // subscribe to dynamic fields
    this.store.fields$.subscribe(fields => {
      this.columns = fields;
    });

    // subscribe to records
    this.store.records$.subscribe(records => {
      this.data = records;
    });

  }

  // receives selected row ids from table
  onSelectionChange(ids: string[]) {
    this.selectedIds = ids;
  }

  // delete action comes from table
  onDeleteSelected(ids: string[]) {
    ids.forEach(id => this.store.deleteRecord(id));
  }

  // row click for edit
  onRowClick(row: any) {
    this.router.navigate(['/edit', row.id]);
  }
}