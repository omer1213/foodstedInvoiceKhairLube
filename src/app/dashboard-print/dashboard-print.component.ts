import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-print',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="!isAuthenticated" style="background: red; color: white; padding: 20px; text-align: center;">
      <h3>❌ AUTHENTICATION FAILED!</h3>
      <p>{{ authMessage }}</p>
      <button (click)="goToLogin()" style="padding: 10px 20px; font-size: 16px;">Go to Login</button>
    </div>
    
    <div *ngIf="isAuthenticated && loading" style="text-align: center; padding: 50px;">
      <h3>✅ Authentication Successful!</h3>
      <p>Redirecting to dashboard and triggering print...</p>
      <p>Invoice ID: {{ invoiceId }}</p>
    </div>
  `,
  styles: []
})
export class SimplePrintComponent implements OnInit {
  userId: string = '';
  invoiceId: string = '';
  isAuthenticated: boolean = false;
  authMessage: string = '';
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userid') || '';
    this.invoiceId = this.route.snapshot.paramMap.get('invoiceid') || '';
    
    console.log('Print URL - User ID:', this.userId);
    console.log('Print URL - Invoice ID:', this.invoiceId);

    this.checkAuthentication();
  }

  checkAuthentication() {
    const storedUserId = localStorage.getItem('khair_user_id');
    const token = localStorage.getItem('khair_token');

    if (!token || !storedUserId) {
      this.isAuthenticated = false;
      this.authMessage = 'Please log in to access this invoice';
      return;
    }

    if (this.userId !== storedUserId) {
      this.isAuthenticated = false;
      this.authMessage = `Access denied. You are not authorized for this invoice.`;
      return;
    }

    // Authentication passed - redirect to dashboard with print trigger
    this.isAuthenticated = true;
    this.loading = true;
    
    // Store the invoice ID for dashboard to pick up
    localStorage.setItem('print_invoice_id', this.invoiceId);
    localStorage.setItem('auto_print', 'true');
    
    // Redirect to dashboard
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 1000);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}