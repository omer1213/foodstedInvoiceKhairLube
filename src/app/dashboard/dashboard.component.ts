import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { InvoiceService, InvoiceResponse } from '../services/invoice.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  invoiceData: InvoiceResponse | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private invoiceService: InvoiceService
  ) {}

  get user() {
    return this.authService.getCurrentUser();
  }

  printContent() {
    const invoiceId = '50985';
    
    this.invoiceService.getInvoiceDetails(invoiceId).subscribe({
      next: (response) => {
        this.invoiceData = response;
        setTimeout(() => {
          window.print();
        }, 100); // Small delay to ensure DOM updates
      },
      error: (error) => {
        console.error('Error fetching invoice:', error);
      }
    });
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


}