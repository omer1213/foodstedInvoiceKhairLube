import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private invoiceService: InvoiceService
  ) {}

  get user() {
    return this.authService.getCurrentUser();
  }

  printContent() {
    window.print();
  }

  navigateToItems() {
    console.log('Dashboard - Navigating to items...');
    console.log('Dashboard - Token in localStorage:', !!localStorage.getItem('khair_token'));
    console.log('Dashboard - User in localStorage:', !!localStorage.getItem('khair_user'));
    this.router.navigate(['/items']);
  }

  logout() {
    this.authService.logoutUser();
  }

  testInvoice() {
    // Using the invoice_id from the API example
    const testInvoiceId = '50985';
    
    this.invoiceService.getInvoiceDetails(testInvoiceId).subscribe({
      next: (response) => {
        console.log('Invoice API Response:', response);
        console.log('Invoice Details:', response.invoice);
        console.log('Invoice Items:', response.invoiced);
      },
      error: (error) => {
        console.error('Error fetching invoice:', error);
      }
    });
  }
}