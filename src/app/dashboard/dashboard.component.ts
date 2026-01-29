
// // code for qr code form claude sonet

// import { Component, signal, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, ActivatedRoute } from '@angular/router';
// import { AuthService, User } from '../services/auth.service';
// import { InvoiceService, InvoiceResponse } from '../services/invoice.service';
// import * as QRCodeLib from 'qrcode';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.css'
// })
// export class DashboardComponent implements OnInit, AfterViewInit {
//   @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef<HTMLCanvasElement>;
  
//   invoiceData: InvoiceResponse | null = null;
//   isPrintMode: boolean = false;
//   // printUserId: string = '';
//   printInvoiceId: string = '';

//   // Pagination properties for multi-page print
//   itemsPerPage: number = 10;
//   invoicePages: any[][] = [];

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private route: ActivatedRoute,
//     private invoiceService: InvoiceService
//   ) {}

//   ngOnInit() {
//     this.printInvoiceId = this.route.snapshot.paramMap.get('invoiceid') || '';
//     if (this.printInvoiceId) {
//       this.isPrintMode = true;
//       console.log('Invoice ID:', this.printInvoiceId);
//       if (this.validatePrintAccess()) {
//         this.printContentWithId(this.printInvoiceId);
//       } else {
//         this.router.navigate(['/login']);
//         return;
//       }
//     }
//   }

//   ngAfterViewInit() {
//     setTimeout(() => {
//       if (this.invoiceData?.qrcode_data) {
//         this.generateQRCode();
//       }
//     }, 100);
//   }

//   async generateQRCode() {
//     if (!this.qrCanvas || !this.qrCanvas.nativeElement) {
//       console.error('Canvas element not found');
//       return;
//     }

//     try {
//       await QRCodeLib.toCanvas(
//         this.qrCanvas.nativeElement,
//         this.invoiceData!.qrcode_data,
//         {
//           width: 60,
//           margin: 1,
//           color: {
//             dark: '#000000',
//             light: '#ffffff'
//           }
//         }
//       );
//       console.log('QR Code generated successfully!');
//     } catch (error) {
//       console.error('Error generating QR code:', error);
//     }
//   }

//   validatePrintAccess(): boolean {
//     const token = localStorage.getItem('khair_token');
//     return true;
//   }

//   printContent() {
//     const invoiceId = '50985';
//     this.printContentWithId(invoiceId);
//   }

//   printContentWithId(invoiceId: string) {
//     console.log('Printing invoice:', invoiceId);
//     this.invoiceService.getInvoiceDetails(invoiceId).subscribe({
//       next: (response) => {
//         console.log('Invoice data received:', response);
//         this.invoiceData = response;
        
//         // Chunk items into pages for pagination
//         this.chunkItemsIntoPages();
        
//         // Generate QR code after data is loaded
//         setTimeout(() => {
//           if (this.invoiceData?.qrcode_data) {
//             this.generateQRCode();
//           }
//         }, 100);
//         // Use autoPrintFallback with 200ms delay on success
//         setTimeout(() => this.autoPrintFallback(), 200);
//       },
//       error: (error) => {
//         console.error('Error fetching invoice:', error);
//         // Still attempt to print the design even on error with 400ms delay
//         setTimeout(() => this.autoPrintFallback(), 400);
//       }
//     });
//   }

//   // Auto print fallback method
//   private autoPrintFallback() {
//     try {
//       console.log('Triggering window.print() via autoPrintFallback');
//       window.print();
//     } catch (e) {
//       console.error('Auto print failed:', e);
//     }
//   }

//   navigateToItems() {
//     console.log('Dashboard - Navigating to items...');
//     console.log('Dashboard - Token in localStorage:', !!localStorage.getItem('khair_token'));
//     console.log('Dashboard - User in localStorage:', !!localStorage.getItem('khair_user'));
//     this.router.navigate(['/items']);
//   }

//   logout() {
//     this.authService.logoutUser();
//   }

//   // Calculate total quantity from all items
//   getTotalQty(): string {
//     if (!this.invoiceData?.invoiced) return '0';
//     const total = this.invoiceData.invoiced.reduce((sum, item) => {
//       return sum + parseFloat(item.invoiced_qty || '0');
//     }, 0);
//     return total.toFixed(2);
//   }

//   // Calculate total amount (without VAT)
//   getTotalAmount(): string {
//     if (!this.invoiceData?.invoiced) return '0.00';
//     const total = this.invoiceData.invoiced.reduce((sum, item) => {
//       return sum + parseFloat(item.invoiced_pricewithoutdiscounttax || '0');
//     }, 0);
//     return total.toFixed(2);
//   }

//   // Calculate total discount
//   getTotalDiscount(): string {
//     if (!this.invoiceData?.invoiced) return '0.00';
//     const total = this.invoiceData.invoiced.reduce((sum, item) => {
//       return sum + parseFloat(item.invoiced_totaldiscount || '0');
//     }, 0);
//     return total.toFixed(2);
//   }

//   // Calculate total VAT amount
//   getTotalVat(): string {
//     if (!this.invoiceData?.invoiced) return '0.00';
//     const total = this.invoiceData.invoiced.reduce((sum, item) => {
//       return sum + parseFloat(item.invoiced_totalvat || '0');
//     }, 0);
//     return total.toFixed(2);
//   }

//   // Calculate net total amount (with VAT)
//   getNetAmount(): string {
//     if (!this.invoiceData?.invoiced) return '0.00';
//     const total = this.invoiceData.invoiced.reduce((sum, item) => {
//       return sum + parseFloat(item.invoiced_netprice || '0');
//     }, 0);
//     return total.toFixed(2);
//   }

//   // Get exactly 9 rows for display (filled + empty)
//   getDisplayItems(): any[] {
//     const items = this.invoiceData?.invoiced || [];
//     const displayItems = items.slice(0, 9); // Take only first 9 items

//     // Fill remaining slots with empty objects to make exactly 9 rows
//     while (displayItems.length < 9) {
//       displayItems.push({
//         item_code: '',
//         item_name: '',
//         item_unit: '',
//         invoiced_qty: '',
//         invoiced_rate: '',
//         invoiced_pricewithoutdiscounttax: '',
//         invoiced_totaldiscount: '',
//         invoiced_totalsaletax: '',
//         invoiced_totalvat: '',
//         invoiced_netprice: '',
//         item_id: '',
//         isEmpty: true
//       });
//     }

//     return displayItems;
//   }

//   // Convert number to words for amount display
//   numberToWords(num: number): string {
//     if (num === 0) return 'zero';

//     const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
//     const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
//     const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
//     const thousands = ['', 'thousand', 'million', 'billion'];

//     function convertHundreds(n: number): string {
//       let result = '';

//       if (n >= 100) {
//         result += ones[Math.floor(n / 100)] + ' hundred ';
//         n %= 100;
//       }

//       if (n >= 20) {
//         result += tens[Math.floor(n / 10)];
//         if (n % 10 > 0) result += ' ' + ones[n % 10];
//       } else if (n >= 10) {
//         result += teens[n - 10];
//       } else if (n > 0) {
//         result += ones[n];
//       }

//       return result.trim();
//     }

//     let result = '';
//     let thousandIndex = 0;

//     while (num > 0) {
//       const chunk = num % 1000;
//       if (chunk > 0) {
//         const chunkWords = convertHundreds(chunk);
//         if (thousandIndex > 0) {
//           result = chunkWords + ' ' + thousands[thousandIndex] + ' ' + result;
//         } else {
//           result = chunkWords + ' ' + result;
//         }
//       }
//       num = Math.floor(num / 1000);
//       thousandIndex++;
//     }

//     return result.trim() + ' only';
//   }

//   // Get net amount in words
//   getNetAmountInWords(): string {
//     if (!this.invoiceData?.invoiced) return 'Zero Only';

//     const netAmount = parseFloat(this.getNetAmount());
//     if (netAmount === 0) return 'Zero Only';

//     const wholePart = Math.floor(netAmount);
//     const decimalPart = Math.round((netAmount - wholePart) * 100);

//     let result = this.numberToWordsFormat(wholePart);

//     if (decimalPart > 0) {
//       const decimalStr = decimalPart.toString().padStart(2, '0');
//       const firstDigit = decimalStr[0];
//       const secondDigit = decimalStr[1];
//       result += ' Point ' + this.digitToWord(parseInt(firstDigit)) + ' ' + this.digitToWord(parseInt(secondDigit));
//     }

//     result += ' Only';
//     return result;
//   }

//   // Convert number to words with proper formatting (commas and 'and')
//   private numberToWordsFormat(num: number): string {
//     if (num === 0) return 'Zero';

//     const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//     const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//     const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
//     const scales = ['', 'Thousand', 'Million', 'Billion'];

//     const convertLessThanHundred = (n: number): string => {
//       if (n >= 20) {
//         let result = tens[Math.floor(n / 10)];
//         if (n % 10 > 0) result += '-' + ones[n % 10];
//         return result;
//       } else if (n >= 10) {
//         return teens[n - 10];
//       } else if (n > 0) {
//         return ones[n];
//       }
//       return '';
//     };

//     const convertHundreds = (n: number): string[] => {
//       const parts: string[] = [];

//       if (n >= 100) {
//         parts.push(ones[Math.floor(n / 100)] + ' Hundred');
//         n %= 100;
//       }

//       if (n > 0) {
//         parts.push(convertLessThanHundred(n));
//       }

//       return parts;
//     };

//     const parts: string[] = [];
//     let scaleIndex = 0;

//     while (num > 0) {
//       const group = num % 1000;
//       if (group > 0) {
//         const groupParts = convertHundreds(group);
//         // Add scale to the last part of this group
//         if (scaleIndex > 0 && groupParts.length > 0) {
//           groupParts[groupParts.length - 1] += ' ' + scales[scaleIndex];
//         }
//         // Add all parts in reverse order (since we're building from right to left)
//         for (let i = groupParts.length - 1; i >= 0; i--) {
//           parts.unshift(groupParts[i]);
//         }
//       }
//       num = Math.floor(num / 1000);
//       scaleIndex++;
//     }

//     // Join with commas and replace last comma with " And "
//     let result = '';
//     for (let i = 0; i < parts.length; i++) {
//       if (i === 0) {
//         result = parts[i];
//       } else if (i === parts.length - 1) {
//         result = result + ' And ' + parts[i];
//       } else {
//         result = result + ', ' + parts[i];
//       }
//     }

//     return result;
//   }

//   // Helper function to convert single digits to words (capitalized)
//   private digitToWord(digit: number): string {
//     const words = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//     return words[digit] || 'Zero';
//   }

//   // ============================================================
//   // MULTI-PAGE PRINT LOGIC - START
//   // ============================================================

//   /**
//    * Chunks invoice items into pages of itemsPerPage size
//    * Called when invoice data is loaded
//    */
//   private chunkItemsIntoPages(): void {
//     const items = this.invoiceData?.invoiced || [];
//     this.invoicePages = [];
    
//     console.log('chunkItemsIntoPages - Total items:', items.length);
//     console.log('chunkItemsIntoPages - Items per page:', this.itemsPerPage);
    
//     for (let i = 0; i < items.length; i += this.itemsPerPage) {
//       const pageItems = items.slice(i, i + this.itemsPerPage);
//       this.invoicePages.push(pageItems);
//       console.log(`chunkItemsIntoPages - Page ${this.invoicePages.length}: ${pageItems.length} items`);
//     }
    
//     // Ensure at least one page exists (even if empty)
//     if (this.invoicePages.length === 0) {
//       this.invoicePages = [[]];
//     }
    
//     console.log('chunkItemsIntoPages - Total pages created:', this.invoicePages.length);
//   }

//   /**
//    * Get all invoice pages for template iteration
//    */
//   getInvoicePages(): any[][] {
//     return this.invoicePages;
//   }

//   /**
//    * Check if this is the last page (for showing totals)
//    */
//   isLastPage(pageIndex: number): boolean {
//     return pageIndex === this.invoicePages.length - 1;
//   }

//   /**
//    * Get items for a specific page with proper POS numbering
//    */
//   getPageItems(pageIndex: number): any[] {
//     const pageItems = this.invoicePages[pageIndex] || [];
//     console.log(`getPageItems(${pageIndex}): returning ${pageItems.length} items from total pages: ${this.invoicePages.length}`);
//     return pageItems.map((item, index) => ({
//       ...item,
//       posNumber: (pageIndex * this.itemsPerPage) + index + 1
//     }));
//   }

//   // ============================================================
//   // MULTI-PAGE PRINT LOGIC - END
//   // ============================================================
// }


import { Component, signal, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { InvoiceService, InvoiceResponse } from '../services/invoice.service';
import * as QRCodeLib from 'qrcode';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef<HTMLCanvasElement>;
  
  invoiceData: InvoiceResponse | null = null;
  isPrintMode: boolean = false;
  printInvoiceId: string = '';

  // Pagination properties for multi-page print
  itemsPerPage: number = 10;
  invoicePages: any[][] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit() {
    this.printInvoiceId = this.route.snapshot.paramMap.get('invoiceid') || '';
    if (this.printInvoiceId) {
      this.isPrintMode = true;
      console.log('Invoice ID:', this.printInvoiceId);
      this.printContentWithId(this.printInvoiceId);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.invoiceData?.qrcode_data) {
        this.generateQRCode();
      }
    }, 100);
  }

  async generateQRCode() {
    if (!this.qrCanvas || !this.qrCanvas.nativeElement) {
      console.error('Canvas element not found');
      return;
    }

    const canvas = this.qrCanvas.nativeElement;
    
    // Set canvas size to match QR code dimensions to prevent clipping
    canvas.width = 90;
    canvas.height = 90;

    try {
      await QRCodeLib.toCanvas(
        canvas,
        this.invoiceData!.qrcode_data,
        {
          width: 90,  // Match the canvas size
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        }
      );
      console.log('QR Code generated successfully on canvas 120x120!');
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }

  printContent() {
    const invoiceId = '50985';
    this.printContentWithId(invoiceId);
  }

  printContentWithId(invoiceId: string) {
    console.log('Printing invoice:', invoiceId);
    this.invoiceService.getInvoiceDetails(invoiceId).subscribe({
      next: (response) => {
        console.log('Invoice data received:', response);
        this.invoiceData = response;
        
        // Chunk items into pages for pagination
        this.chunkItemsIntoPages();
        
        // Generate QR code after data is loaded
        setTimeout(() => {
          if (this.invoiceData?.qrcode_data) {
            this.generateQRCode();
          }
        }, 100);
        // Use autoPrintFallback with 200ms delay on success
        setTimeout(() => this.autoPrintFallback(), 200);
      },
      error: (error) => {
        console.error('Error fetching invoice:', error);
        // Still attempt to print the design even on error with 400ms delay
        setTimeout(() => this.autoPrintFallback(), 400);
      }
    });
  }

  // Auto print fallback method
  private autoPrintFallback() {
    try {
      console.log('Triggering window.print() via autoPrintFallback');
      window.print();
    } catch (e) {
      console.error('Auto print failed:', e);
    }
  }

  navigateToItems() {
    console.log('Dashboard - Navigating to items...');
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
    if (!this.invoiceData?.invoiced) return 'Zero Only';

    const netAmount = parseFloat(this.getNetAmount());
    if (netAmount === 0) return 'Zero Only';

    const wholePart = Math.floor(netAmount);
    const decimalPart = Math.round((netAmount - wholePart) * 100);

    let result = this.numberToWordsFormat(wholePart);

    if (decimalPart > 0) {
      const decimalStr = decimalPart.toString().padStart(2, '0');
      const firstDigit = decimalStr[0];
      const secondDigit = decimalStr[1];
      result += ' Point ' + this.digitToWord(parseInt(firstDigit)) + ' ' + this.digitToWord(parseInt(secondDigit));
    }

    result += ' Only';
    return result;
  }

  // Convert number to words with proper formatting (commas and 'and')
  private numberToWordsFormat(num: number): string {
    if (num === 0) return 'Zero';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const scales = ['', 'Thousand', 'Million', 'Billion'];

    const convertLessThanHundred = (n: number): string => {
      if (n >= 20) {
        let result = tens[Math.floor(n / 10)];
        if (n % 10 > 0) result += '-' + ones[n % 10];
        return result;
      } else if (n >= 10) {
        return teens[n - 10];
      } else if (n > 0) {
        return ones[n];
      }
      return '';
    };

    const convertHundreds = (n: number): string[] => {
      const parts: string[] = [];

      if (n >= 100) {
        parts.push(ones[Math.floor(n / 100)] + ' Hundred');
        n %= 100;
      }

      if (n > 0) {
        parts.push(convertLessThanHundred(n));
      }

      return parts;
    };

    const parts: string[] = [];
    let scaleIndex = 0;

    while (num > 0) {
      const group = num % 1000;
      if (group > 0) {
        const groupParts = convertHundreds(group);
        // Add scale to the last part of this group
        if (scaleIndex > 0 && groupParts.length > 0) {
          groupParts[groupParts.length - 1] += ' ' + scales[scaleIndex];
        }
        // Add all parts in reverse order (since we're building from right to left)
        for (let i = groupParts.length - 1; i >= 0; i--) {
          parts.unshift(groupParts[i]);
        }
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    // Join with commas and replace last comma with " And "
    let result = '';
    for (let i = 0; i < parts.length; i++) {
      if (i === 0) {
        result = parts[i];
      } else if (i === parts.length - 1) {
        result = result + ' And ' + parts[i];
      } else {
        result = result + ', ' + parts[i];
      }
    }

    return result;
  }

  // Helper function to convert single digits to words (capitalized)
  private digitToWord(digit: number): string {
    const words = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    return words[digit] || 'Zero';
  }

  // ============================================================
  // MULTI-PAGE PRINT LOGIC - START
  // ============================================================

  /**
   * Chunks invoice items into pages of itemsPerPage size
   * Called when invoice data is loaded
   */
  private chunkItemsIntoPages(): void {
    const items = this.invoiceData?.invoiced || [];
    this.invoicePages = [];
    
    console.log('chunkItemsIntoPages - Total items:', items.length);
    console.log('chunkItemsIntoPages - Items per page:', this.itemsPerPage);
    
    for (let i = 0; i < items.length; i += this.itemsPerPage) {
      const pageItems = items.slice(i, i + this.itemsPerPage);
      this.invoicePages.push(pageItems);
      console.log(`chunkItemsIntoPages - Page ${this.invoicePages.length}: ${pageItems.length} items`);
    }
    
    // Ensure at least one page exists (even if empty)
    if (this.invoicePages.length === 0) {
      this.invoicePages = [[]];
    }
    
    console.log('chunkItemsIntoPages - Total pages created:', this.invoicePages.length);
  }

  /**
   * Get all invoice pages for template iteration
   */
  getInvoicePages(): any[][] {
    return this.invoicePages;
  }

  /**
   * Check if this is the last page (for showing totals)
   */
  isLastPage(pageIndex: number): boolean {
    return pageIndex === this.invoicePages.length - 1;
  }

  /**
   * Get items for a specific page with proper POS numbering
   */
  getPageItems(pageIndex: number): any[] {
    const pageItems = this.invoicePages[pageIndex] || [];
    console.log(`getPageItems(${pageIndex}): returning ${pageItems.length} items from total pages: ${this.invoicePages.length}`);
    return pageItems.map((item, index) => ({
      ...item,
      posNumber: (pageIndex * this.itemsPerPage) + index + 1
    }));
  }

  // ============================================================
  // MULTI-PAGE PRINT LOGIC - END
  // ============================================================
}