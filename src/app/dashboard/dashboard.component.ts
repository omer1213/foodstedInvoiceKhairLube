import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { InvoiceService, InvoiceResponse } from '../services/invoice.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  invoiceData: InvoiceResponse | null = null;
  isPrintMode: boolean = false;
  printUserId: string = '';
  printInvoiceId: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit() {
    // Check if this is a print URL access
    this.printUserId = this.route.snapshot.paramMap.get('userid') || '';
    this.printInvoiceId = this.route.snapshot.paramMap.get('invoiceid') || '';
    
    if (this.printUserId && this.printInvoiceId) {
      // This is print URL access
      this.isPrintMode = true;
      console.log('Print mode detected - User ID:', this.printUserId, 'Invoice ID:', this.printInvoiceId);
      
      // Check authentication for print access
      if (this.validatePrintAccess()) {
        // Auto-print with the URL invoice ID
        this.printContentWithId(this.printInvoiceId);
      } else {
        // Redirect to login if not authenticated
        this.router.navigate(['/login']);
        return;
      }
    }
    
    // Regular dashboard initialization code can go here if needed
  }

  validatePrintAccess(): boolean {
    const storedUserId = localStorage.getItem('khair_user_id');
    const token = localStorage.getItem('khair_token');

    if (!token || !storedUserId) {
      console.log('Print access denied: No authentication');
      return false;
    }

    if (this.printUserId !== storedUserId) {
      console.log('Print access denied: User ID mismatch');
      return false;
    }

    console.log('Print access granted for user:', this.printUserId);
    return true;
  }

  get user() {
    return this.authService.getCurrentUser();
  }

  printContent() {
    const invoiceId = '50985';
    this.printContentWithId(invoiceId);
  }

  printContentWithId(invoiceId: string) {
    console.log('Printing invoice:', invoiceId);
    
    this.invoiceService.getInvoiceDetails(invoiceId).subscribe({
      next: (response) => {
        this.invoiceData = response;
        setTimeout(() => {
          window.print();
          // Close window if it was opened from print URL
          if (this.isPrintMode) {
            setTimeout(() => {
              window.close();
            }, 2000);
          }
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

  // Get exactly 9 rows for display (filled + empty)
  getDisplayItems(): any[] {
    const items = this.invoiceData?.invoiced || [];
    const displayItems = items.slice(0, 9); // Take only first 9 items
    
    // Fill remaining slots with empty objects to make exactly 9 rows
    while (displayItems.length < 9) {
      displayItems.push({
        item_code: '',
        item_name: '',
        item_unit: '',
        invoiced_qty: '',
        invoiced_rate: '',
        invoiced_pricewithoutdiscounttax: '',
        invoiced_totaldiscount: '',
        invoiced_totalsaletax: '',
        invoiced_totalvat: '',
        invoiced_netprice: '',
        item_id: '',
        isEmpty: true
      });
    }
    
    return displayItems;
  }

  // Convert number to words for amount display
  numberToWords(num: number): string {
    if (num === 0) return 'zero';
    
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const thousands = ['', 'thousand', 'million', 'billion'];

    function convertHundreds(n: number): string {
      let result = '';
      
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + ' hundred ';
        n %= 100;
      }
      
      if (n >= 20) {
        result += tens[Math.floor(n / 10)];
        if (n % 10 > 0) result += ' ' + ones[n % 10];
      } else if (n >= 10) {
        result += teens[n - 10];
      } else if (n > 0) {
        result += ones[n];
      }
      
      return result.trim();
    }

    let result = '';
    let thousandIndex = 0;
    
    while (num > 0) {
      const chunk = num % 1000;
      if (chunk > 0) {
        const chunkWords = convertHundreds(chunk);
        if (thousandIndex > 0) {
          result = chunkWords + ' ' + thousands[thousandIndex] + ' ' + result;
        } else {
          result = chunkWords + ' ' + result;
        }
      }
      num = Math.floor(num / 1000);
      thousandIndex++;
    }
    
    return result.trim() + ' only';
  }

  // Get net amount in words
  getNetAmountInWords(): string {
    if (!this.invoiceData?.invoiced) return 'zero only';
    const netAmount = parseFloat(this.getNetAmount());
    
    const wholePart = Math.floor(netAmount);
    const decimalPart = Math.round((netAmount - wholePart) * 100);
    
    let result = this.numberToWords(wholePart);
    
    if (decimalPart > 0) {
      result += ' and ' + this.numberToWords(decimalPart) + ' cents';
    } else {
      result += ' only';
    }
    
    return result;
  }


}