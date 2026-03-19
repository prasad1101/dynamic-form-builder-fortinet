import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../../core/services/snackbar-service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar-component.html',
})
export class SnackbarComponent {

  snackbar = inject(SnackbarService);
  messages$ = this.snackbar.messages$;

  remove(id: string) {
    this.snackbar.remove(id);
  }

}