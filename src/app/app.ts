import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ModalService } from './services/modal.service';
import { ConfirmationModalComponent } from './shared/confirmation-modal/confirmation-modal.component';
import { SuccessModalComponent } from './shared/success-modal/success-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ConfirmationModalComponent, SuccessModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit {
  protected readonly title = 'printKhairLubricant';

  @ViewChild(ConfirmationModalComponent) confirmModal?: ConfirmationModalComponent;
  @ViewChild(SuccessModalComponent) successModal?: SuccessModalComponent;

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: ModalService
  ) {}

  ngAfterViewInit() {
    // Register modals with the modal service after view is initialized
    if (this.confirmModal) {
      this.modalService.setConfirmModal(this.confirmModal);
    }
    if (this.successModal) {
      this.modalService.setSuccessModal(this.successModal);
    }
  }

  ngOnInit() {
    // Register modals with the modal service
    if (this.confirmModal) {
      this.modalService.setConfirmModal(this.confirmModal);
    }
    if (this.successModal) {
      this.modalService.setSuccessModal(this.successModal);
    }

    // Check if user is authenticated on app initialization
    const isAuthenticated = this.authService.getIsAuthenticated()();
    const currentRoute = this.router.url;
    
    if (isAuthenticated && (currentRoute === '/login' || currentRoute === '/')) {
      // If authenticated and on login page, redirect to dashboard
      this.router.navigate(['/dashboard']);
    } else if (!isAuthenticated && currentRoute !== '/login') {
      // If not authenticated and not on login page, redirect to login
      this.router.navigate(['/login']);
    }
  }
}
