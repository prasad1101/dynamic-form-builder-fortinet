import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormStoreService } from '../../../core/services/form-store';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { FieldConfig } from '../../../core/models/field.model';
import { SnackbarService } from '../../../core/services/snackbar-service';

@Component({
  selector: 'app-fields-panel',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './fields-panel.html'
})
export class FieldsPanelComponent {

  store = inject(FormStoreService);
  private snackbar = inject(SnackbarService);

  fields$ = this.store.fields$;

  // local copy for drag reorder (same as your original)
  fields: FieldConfig[] = [];

  ngOnInit() {
    this.fields$.subscribe(f => {
      this.fields = [...f]; // keep clone (important for immutability)
    });
  }

  select(field: FieldConfig) {
    this.store.selectField(field);
  }

  addNew() {
    this.store.createNewField();
  }

  drop(event: CdkDragDrop<FieldConfig[]>) {
    moveItemInArray(this.fields, event.previousIndex, event.currentIndex);
    // persist correct order
    this.store.updateFields(this.fields);
    this.snackbar.success('Field order updated');
  }

}