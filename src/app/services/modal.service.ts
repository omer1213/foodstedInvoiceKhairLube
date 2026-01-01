import { Injectable } from '@angular/core';
import { ConfirmationModalComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { SuccessModalComponent } from '../shared/success-modal/success-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private confirmModal?: ConfirmationModalComponent;
  private successModal?: SuccessModalComponent;

  setConfirmModal(modal: ConfirmationModalComponent) {
    this.confirmModal = modal;
  }

  setSuccessModal(modal: SuccessModalComponent) {
    this.successModal = modal;
  }

  confirm(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.confirmModal) {
        this.confirmModal.show(
          title,
          message,
          () => resolve(true),
          () => resolve(false)
        );
      }
    });
  }

  success(message: string, onClose?: () => void) {
    if (this.successModal) {
      this.successModal.show(message, onClose);
    }
  }
}
