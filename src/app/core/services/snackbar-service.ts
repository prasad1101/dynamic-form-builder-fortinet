import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SnackbarMessage, SnackbarType } from '../models/snackbar.model';

@Injectable({ providedIn: 'root' })
export class SnackbarService {

  private messagesSubject = new BehaviorSubject<SnackbarMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private defaultDuration = 3000;

  private get messages() {
    return this.messagesSubject.value;
  }

  show(text: string, type: SnackbarType = 'info', duration?: number) {
    const message: SnackbarMessage = {
      id: crypto.randomUUID(),
      text,
      type,
      duration: duration ?? this.defaultDuration
    };

    this.messagesSubject.next([...this.messages, message]);

    this.autoDismiss(message);
  }

  success(text: string, duration?: number) {
    this.show(text, 'success', duration);
  }

  error(text: string, duration?: number) {
    this.show(text, 'error', duration);
  }

  info(text: string, duration?: number) {
    this.show(text, 'info', duration);
  }

  warning(text: string, duration?: number) {
    this.show(text, 'warning', duration);
  }

  remove(id: string) {
    this.messagesSubject.next(this.messages.filter(m => m.id !== id));
  }

  private autoDismiss(message: SnackbarMessage) {
    setTimeout(() => {
      this.remove(message.id);
    }, message.duration);
  }

}