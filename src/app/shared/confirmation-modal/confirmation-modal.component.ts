import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css'
})
export class ConfirmationModalComponent {
  isVisible = signal(false);
  title = signal('');
  message = signal('');
  onConfirm?: () => void;
  onCancel?: () => void;

  show(title: string, message: string, onConfirm: () => void, onCancel: () => void) {
    this.title.set(title);
    this.message.set(message);
    this.onConfirm = onConfirm;
    this.onCancel = onCancel;
    this.isVisible.set(true);
  }

  confirm() {
    this.isVisible.set(false);
    if (this.onConfirm) {
      this.onConfirm();
    }
  }

  cancel() {
    this.isVisible.set(false);
    if (this.onCancel) {
      this.onCancel();
    }
  }
}
