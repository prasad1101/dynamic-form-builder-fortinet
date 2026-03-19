import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SnackbarComponent } from './shared/components/snackbar-component/snackbar-component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, SnackbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('fortinet-dynamic-form-builder');
}
