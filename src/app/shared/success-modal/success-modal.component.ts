import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-modal.component.html',
  styleUrl: './success-modal.component.css'
})
export class SuccessModalComponent {
  isVisible = signal(false);
  message = signal('');
  private timeoutId?: number;
  onClose?: () => void;

  show(message: string, onClose?: () => void) {
    this.message.set(message);
    this.onClose = onClose;
    this.isVisible.set(true);

    // Clear any existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Auto close after 3 seconds
    this.timeoutId = setTimeout(() => {
      this.close();
    }, 3000);
  }

  close() {
    this.isVisible.set(false);
    this.message.set(''); // Clear the message
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
    if (this.onClose) {
      this.onClose();
    }
  }
}
