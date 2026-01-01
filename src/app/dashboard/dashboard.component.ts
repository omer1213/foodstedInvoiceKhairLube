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

  // Calculate total quantity from all items
  getTotalQty(): string {
    if (!this.invoiceData?.invoiced) return '0';
    const total = this.invoiceData.invoiced.reduce((sum, item) => {
      return sum + parseFloat(item.invoiced_qty || '0');
    }, 0);
    return total.toFixed(2);
  }

  // Calculate total amount (without VAT)
  getTotalAmount(): string {
    if (!this.invoiceData?.invoiced) return '0.00';
    const total = this.invoiceData.invoiced.reduce((sum, item) => {
      return sum + parseFloat(item.invoiced_pricewithoutdiscounttax || '0');
    }, 0);
    return total.toFixed(2);
  }

  // Calculate total discount
  getTotalDiscount(): string {
    if (!this.invoiceData?.invoiced) return '0.00';
    const total = this.invoiceData.invoiced.reduce((sum, item) => {
      return sum + parseFloat(item.invoiced_totaldiscount || '0');
    }, 0);
    return total.toFixed(2);
  }

  // Calculate total VAT amount
  getTotalVat(): string {
    if (!this.invoiceData?.invoiced) return '0.00';
    const total = this.invoiceData.invoiced.reduce((sum, item) => {
      return sum + parseFloat(item.invoiced_totalvat || '0');
    }, 0);
    return total.toFixed(2);
  }

  // Calculate net total amount (with VAT)
  getNetAmount(): string {
    if (!this.invoiceData?.invoiced) return '0.00';
    const total = this.invoiceData.invoiced.reduce((sum, item) => {
      return sum + parseFloat(item.invoiced_netprice || '0');
    }, 0);
    return total.toFixed(2);
  }


}