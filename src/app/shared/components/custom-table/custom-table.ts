import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './custom-table.html'
})
export class CustomTableComponent implements OnChanges {

  @Input() columns: any[] = [];
  @Input() data: any[] = [];

  @Output() selectionChange = new EventEmitter<string[]>();
  @Output() deleteSelected = new EventEmitter<string[]>();
  @Output() rowClick = new EventEmitter<any>();

  filteredData: any[] = [];

  columnFilters: Record<string, string> = {};
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  page = 1;
  pageSize = 10;

  selectedRows = new Set<string>();

  ngOnChanges() {
    // reset selection when data changes
    this.selectedRows.clear();
    this.applyAll();
  }

  // helper to safely get unique id
  private getRowId(row: any): string {
    return row?.id ?? row?._id ?? JSON.stringify(row);
  }

  // column filter
  onFilter(value: string, key: string) {
    this.columnFilters[key] = value.toLowerCase();
    this.applyAll();
  }

  // sorting
  sort(key: string) {

    if (this.sortColumn === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = key;
      this.sortDirection = 'asc';
    }

    this.applyAll();
  }

  applyAll(inputData?: any[]) {

    let data = inputData ? [...inputData] : [...this.data];

    data = data.filter(row => row && Object.keys(row).length > 0);

    data = data.filter(row =>
      Object.keys(this.columnFilters).every(key => {
        const val = this.columnFilters[key];
        if (!val) return true;
        return row[key]?.toString().toLowerCase().includes(val);
      })
    );

    if (this.sortColumn) {
      data.sort((a, b) => {
        let v1 = a[this.sortColumn];
        let v2 = b[this.sortColumn];

        v1 = v1 ?? '';
        v2 = v2 ?? '';

        if (!isNaN(v1) && !isNaN(v2)) {
          return this.sortDirection === 'asc' ? v1 - v2 : v2 - v1;
        }

        return this.sortDirection === 'asc'
          ? v1.toString().localeCompare(v2.toString())
          : v2.toString().localeCompare(v1.toString());
      });
    }

    this.filteredData = data;

    const total = this.totalPages();
    this.page = this.page > total ? total : 1;
  }

  // pagination
  get paginatedData() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredData.length / this.pageSize) || 1;
  }

  changePage(p: number) {
    if (p < 1 || p > this.totalPages()) return;
    this.page = p;
  }

  // selection
  toggleRow(row: any) {
    const id = this.getRowId(row);

    if (this.selectedRows.has(id)) {
      this.selectedRows.delete(id);
    } else {
      this.selectedRows.add(id);
    }

    this.emitSelection();
  }

  toggleAll(event: any) {
    if (event.target.checked) {
      this.filteredData.forEach(r => {
        const id = this.getRowId(r);
        this.selectedRows.add(id);
      });
    } else {
      this.selectedRows.clear();
    }

    this.emitSelection();
  }

  isSelected(row: any) {
    return this.selectedRows.has(this.getRowId(row));
  }

  private emitSelection() {
    this.selectionChange.emit(Array.from(this.selectedRows));
  }

  onDeleteSelected() {
    this.deleteSelected.emit(Array.from(this.selectedRows));
    this.selectedRows.clear();
    this.emitSelection();
  }

  onGlobalSearch(value: string) {
    const search = value.toLowerCase().trim();

    if (!search) {
      this.applyAll();
      return;
    }

    const filtered = this.data.filter(row =>
      this.columns.some(col =>
        row[col.key]?.toString().toLowerCase().includes(search)
      )
    );

    this.page = 1;
    this.applyAll(filtered);
  }

  toggleSelectAllMobile() {

    const allSelected = this.paginatedData.every(row =>
      this.selectedRows.has(row.id)
    );

    if (allSelected) {
      this.paginatedData.forEach(row =>
        this.selectedRows.delete(row.id)
      );
    } else {
      this.paginatedData.forEach(row =>
        this.selectedRows.add(row.id)
      );
    }
  }

}