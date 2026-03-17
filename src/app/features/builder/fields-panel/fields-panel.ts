import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormStoreService } from '../../../core/services/form-store';

@Component({
  selector: 'app-fields-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fields-panel.html'
})
export class FieldsPanelComponent {

  store = inject(FormStoreService);
  fields$ = this.store.fields$;

  select(field: any) {
    this.store.selectField(field);
  }

  addNew() {
    this.store.createNewField();
  }

}