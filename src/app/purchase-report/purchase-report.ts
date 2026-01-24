import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseReportService } from '../services/purchase-report';
import { DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormsModule } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-sale-report',
  standalone: true,
  imports: [CommonModule, DataTablesModule, FormsModule],
  templateUrl: './purchase-report.html',
  styleUrls: ['./purchase-report.css'],
})
export class PurchaseReportComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dataTable', { static: false }) table!: ElementRef;
  
  invoiceData: any[] = [];
  displayedData: any[] = [];
  filteredData: any[] = [];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  isLoading: boolean = false;
  fromDate: string = '';
  toDate: string = '';
  
  // Custom pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 25;
  totalPages: number = 1;
  totalItems: number = 0;

  // Search property
  searchTerm: string = '';

  // Sorting properties
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private route: ActivatedRoute,
    private purchaseReportService: PurchaseReportService
  ) {}

  ngOnInit() {
    // Simple DataTables configuration without pagination
    this.dtOptions = {
      paging: false,
      searching: false,
      ordering: false,
      info: false,
      responsive: false,
      columnDefs: [
        { targets: [7, 8, 9, 10], className: 'text-right' }, // Total, Discount, VAT, Payable
        { targets: [0], className: 'text-center' },
        { targets: '_all', className: 'text-center' }
      ]
    };

    // Read query parameters from URL
    this.route.queryParams.subscribe(params => {
      const fromDate = params['from_date'];
      const toDate = params['to_date'];
      const getSalesReport = params['get_salesreport'] || '1';

      this.fromDate = fromDate;
      this.toDate = toDate;

      console.log('URL Parameters:');
      console.log('from_date:', fromDate);
      console.log('to_date:', toDate);
      console.log('get_salesreport:', getSalesReport);

      // Call API if we have required parameters
      if (fromDate && toDate && getSalesReport) {
        this.fetchSalesReport(fromDate, toDate, getSalesReport);
      } else {
        console.warn('Missing required parameters: from_date, to_date, or get_salesreport');
      }
    });
  }

  private fetchSalesReport(fromDate: string, toDate: string, getSalesReport: string) {
    console.log('Calling Sales Report API...');
    this.isLoading = true;
    this.purchaseReportService.getPurchaseReport(fromDate, toDate, getSalesReport)
      .subscribe({
        next: (response) => {
          console.log('Sales Report Response:', response);
          this.isLoading = false;
          if (response && response.purchase_list) {
            this.invoiceData = response.purchase_list;
            this.filteredData = [...this.invoiceData];
            this.totalItems = this.filteredData.length;
            this.updatePagination();
            setTimeout(() => {
              this.dtTrigger.next(null);
            }, 100);
          }
        },
        error: (error) => {
          console.error('Error fetching sales report:', error);
          this.isLoading = false;
        }
      });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedData = this.filteredData.slice(startIndex, endIndex);
  }

  sortData(column: string): void {
    if (this.sortColumn === column) {
      // Toggle direction if same column
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, start with ascending
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // Sort the full filteredData array
    this.filteredData.sort((a, b) => {
      let valueA = a[column];
      let valueB = b[column];

      // Handle numeric columns
      if (['Total', 'Discount', 'VAT', 'Payable'].includes(column)) {
        valueA = parseFloat(valueA) || 0;
        valueB = parseFloat(valueB) || 0;
      } else if (column === 'Date') {
        // For dates, convert to Date objects
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      } else {
        // For strings, use lowercase for case-insensitive sort
        valueA = (valueA || '').toString().toLowerCase();
        valueB = (valueB || '').toString().toLowerCase();
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    // Reset to first page and update pagination after sorting
    this.currentPage = 1;
    this.updatePagination();
  }

  onSearch(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredData = [...this.invoiceData];
    } else {
      this.filteredData = this.invoiceData.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    }
    this.totalItems = this.filteredData.length;
    this.currentPage = 1;
    this.updatePagination();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getDisplayInfo(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `Showing ${start} to ${end} of ${this.totalItems} entries`;
  }

  // Page totals (only for currently displayed items)
  getPageTotalQuantity(): number {
    return this.displayedData.length;  // Number of invoices
  }

  getPageTotalAmount(): number {
    let purchaseTotal = 0;
    let purchaseReturnTotal = 0;

    this.displayedData.forEach(item => {
      const totalAmount = parseFloat(item.Total) || 0;
      if (item.Type === 'purchase') {
        purchaseTotal += totalAmount;
      } else if (item.Type === 'purchaseReturn') {
        purchaseReturnTotal += totalAmount;
      }
    });

    return purchaseTotal - purchaseReturnTotal;
  }

  // Grand totals (for all items)
  getTotalQuantity(): number {
    return this.invoiceData.length;  // Total invoices
  }

  getTotalAmount(): number {
    return this.invoiceData.reduce((total, item) => total + (parseFloat(item.Total) || 0), 0);
  }

  getTotalPayableAmount(): number {
    let purchaseTotal = 0;
    let purchaseReturnTotal = 0;

    this.invoiceData.forEach(item => {
      const payableAmount = parseFloat(item.Payable) || 0;
      if (item.Type === 'purchase') {
        purchaseTotal += payableAmount;
      } else if (item.Type === 'purchaseReturn') {
        purchaseReturnTotal += payableAmount;
      }
    });

    return purchaseTotal - purchaseReturnTotal;
  }

  // Check if current page is the last page
  isLastPage(): boolean {
    return this.currentPage === this.totalPages;
  }

  ngAfterViewInit(): void {
    // DataTable will be initialized when data is loaded
  }

  ngOnDestroy(): void {
    // Clean up DataTable
    this.dtTrigger.unsubscribe();
  }
//data for the csv file changing
  exportToCSV(): void {
    if (this.invoiceData.length === 0) {
      alert('No data available to export.');
      return;
    }

    const headers = ['Sr', 'Type', 'No', 'Date', 'SupplierInvoiceNo', 'SupplierID', 'SupplierName', 'Total', 'Discount', 'VAT', 'Payable'];
    const csvContent = [headers.join(',')];

    this.invoiceData.forEach((item, index) => {
      const row = [
        index + 1,
        item.Type,
        item.No,
        item.Date,
        item.SupplierInvoiceNo,
        item.SupplierID,
        `"${item.SupplierName}"`,
        item.Total,
        item.Discount,
        item.VAT,
        item.Payable
      ];
      csvContent.push(row.join(','));
    });

    // Add totals to CSV
    csvContent.push(''); // Empty line
    const pageTotalRow = ['', '', '', '', '', '', '', '', '', '', 'Page Total:', this.getPageTotalAmount().toFixed(2)];
    csvContent.push(pageTotalRow.join(','));
    const grandTotalRow = ['', '', '', '', '', '', '', '', '', '', 'Grand Total:', this.getTotalPayableAmount().toFixed(2)];
    csvContent.push(grandTotalRow.join(','));

    const csvData = csvContent.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const filename = `purchase_report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToExcel(): void {
    if (this.invoiceData.length === 0) {
      alert('No data available to export.');
      return;
    }
//data for the excelContent file changing
    // Create Excel content (using HTML table format for Excel)
    let excelContent = `
      <table border="1">
        <tr>
          <th>Sr</th>
          <th>Type</th>
          <th>No</th>
          <th>Date</th>
          <th>SupplierInvoiceNo</th>
          <th>SupplierID</th>
          <th>SupplierName</th>
          <th>Total</th>
          <th>Discount</th>
          <th>VAT</th>
          <th>Payable</th>
        </tr>`;

    this.invoiceData.forEach((item, index) => {
      excelContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.Type}</td>
          <td>${item.No}</td>
          <td>${item.Date}</td>
          <td>${item.SupplierInvoiceNo}</td>
          <td>${item.SupplierID}</td>
          <td>${item.SupplierName}</td>
          <td>${item.Total}</td>
          <td>${item.Discount}</td>
          <td>${item.VAT}</td>
          <td>${item.Payable}</td>
        </tr>`;
    });

    // Add total row
    excelContent += `
        <tr style="font-weight: bold; background-color: #e9ecef;">
          <td colspan="10">Page Total:</td>
          <td>${this.getPageTotalAmount().toFixed(2)}</td>
        </tr>
        <tr style="font-weight: bold; background-color: #d1ecf1;">
          <td colspan="10">Grand Total:</td>
          <td>${this.getTotalPayableAmount().toFixed(2)}</td>
        </tr>
      </table>`;

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const filename = `purchase_report_${new Date().toISOString().slice(0, 10)}.xls`;
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
//data for the pdf file changing
  exportToPDF(landscape: boolean = false): void {
    if (this.invoiceData.length === 0) {
      alert('No data available to export.');
      return;
    }

    // Create new PDF document
    const doc = new jsPDF({
      orientation: landscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add company header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Khair Lubricant', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Dammam Saudi Arabia', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Purchase Report', doc.internal.pageSize.getWidth() / 2, 45, { align: 'center' });
    
    if (this.fromDate && this.toDate) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`${this.fromDate} to ${this.toDate}`, doc.internal.pageSize.getWidth() / 2, 55, { align: 'center' });
    }

    // Prepare table data WITHOUT total row
    const tableData = this.invoiceData.map((item, index) => {
      return [
        index + 1,
        item.Type,
        item.No,
        item.Date,
        item.SupplierInvoiceNo,
        item.SupplierID,
        item.SupplierName,
        item.Total,
        item.Discount,
        item.VAT,
        item.Payable
      ];
    });

    // Generate table without total row first
    autoTable(doc, {
      startY: 65,
      head: [['Sr', 'Type', 'No', 'Date', 'Supplier Invoice No', 'Supplier ID', 'Supplier Name', 'Total', 'Discount', 'VAT', 'Payable']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [248, 249, 250],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        halign: 'center',
        fontSize: 7  // Smaller font for more columns
      },
      columnStyles: {
        0: { halign: 'center' }, // Sr
        1: { halign: 'center' }, // Type
        2: { halign: 'center' }, // No
        3: { halign: 'center' }, // Date
        4: { halign: 'center' }, // SupplierInvoiceNo
        5: { halign: 'center' }, // SupplierID
        6: { halign: 'left' },   // SupplierName
        7: { halign: 'right' },  // Total
        8: { halign: 'right' },  // Discount
        9: { halign: 'right' },  // VAT
        10: { halign: 'right' }  // Payable
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      margin: { top: 10, right: 10, bottom: 10, left: 10 }
    });

    // Add total row ONLY at the end (after all data)
    const finalY = (doc as any).lastAutoTable.finalY + 5;
    
    // Add total row manually
    autoTable(doc, {
      startY: finalY,
      head: [],
      body: [[
        '', '', '', '', '', '', '', '', '', '', 'Page Total:',
        this.getPageTotalAmount().toFixed(2)
      ]],
      theme: 'plain',
      bodyStyles: {
        halign: 'center',
        fontSize: 9,
        fontStyle: 'bold',
        fillColor: [233, 236, 239]
      },
      columnStyles: {
        10: { halign: 'left', fontStyle: 'bold' },   // "Page Total:" label
        11: { halign: 'right', fontStyle: 'bold' }   // Total Amount
      },
      margin: { top: 0, right: 10, bottom: 10, left: 10 }
    });

    // Add Grand Total row
    const grandTotalY = (doc as any).lastAutoTable.finalY + 3;
    autoTable(doc, {
      startY: grandTotalY,
      head: [],
      body: [[
        '', '', '', '', '', '', '', '', '', '', 'Grand Total:',
        this.getTotalPayableAmount().toFixed(2)
      ]],
      theme: 'plain',
      bodyStyles: {
        halign: 'center',
        fontSize: 9,
        fontStyle: 'bold',
        fillColor: [209, 236, 241]
      },
      columnStyles: {
        10: { halign: 'left', fontStyle: 'bold' },   // "Grand Total:" label
        11: { halign: 'right', fontStyle: 'bold' }   // Grand Total Amount
      },
      margin: { top: 0, right: 10, bottom: 10, left: 10 }
    });

    // Save the PDF
    const filename = `purchase_report_${landscape ? 'landscape_' : ''}${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
  }
  printReport(): void {
    if (this.invoiceData.length === 0) {
      alert('No data available to print.');
      return;
    }

    let printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Purchase Report - Print</title>
        <style>
          @media print { 
            @page { size: A4; margin: 1cm; }
            body { font-family: Arial, sans-serif; font-size: 11px; margin: 0; }
          }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 20px; }
          .header h2 { margin: 3px 0; font-size: 14px; color: #666; }
          .header h3 { margin: 5px 0; font-size: 16px; }
          .data-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .total-table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 4px; text-align: center; font-size: 10px; }
          th { background-color: #f8f9fa; font-weight: bold; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }
          .total-row { background-color: #d1ecf1; font-weight: bold; color: #0c5460; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Khair Lubricant</h1>
          <h2>Dammam Saudi Arabia</h2>
          <h3>Purchase Report</h3>
          ${this.fromDate && this.toDate ? `<p>${this.fromDate} to ${this.toDate}</p>` : ''}
        </div>
        
        <table class="data-table">
          <thead>
            <tr>
              <th>Sr</th>
              <th>Type</th>
              <th>No</th>
              <th>Date</th>
              <th>Supplier Invoice No</th>
              <th>Supplier ID</th>
              <th>Supplier Name</th>
              <th>Total</th>
              <th>Discount</th>
              <th>VAT</th>
              <th>Payable</th>
            </tr>
          </thead>
          <tbody>`;

    // Add all data rows
    this.invoiceData.forEach((item, index) => {
      printContent += `
            <tr>
              <td>${index + 1}</td>
              <td>${item.Type}</td>
              <td>${item.No}</td>
              <td>${item.Date}</td>
              <td>${item.SupplierInvoiceNo}</td>
              <td>${item.SupplierID}</td>
              <td class="text-left">${item.SupplierName}</td>
              <td class="text-right">${item.Total}</td>
              <td class="text-right">${item.Discount}</td>
              <td class="text-right">${item.VAT}</td>
              <td class="text-right">${item.Payable}</td>
            </tr>`;
    });

    // Close data table
    printContent += `
          </tbody>
        </table>
        
        <table class="total-table">
          <tbody>
            <tr class="total-row">
              <td colspan="10" style="text-align: right; font-weight: bold; font-size: 12px;">Page Total:</td>
              <td style="text-align: right; font-weight: bold; font-size: 12px;">${this.getPageTotalAmount().toFixed(2)}</td>
            </tr>
            <tr class="grand-total-row">
              <td colspan="10" style="text-align: right; font-weight: bold; font-size: 12px;">Grand Total:</td>
              <td style="text-align: right; font-weight: bold; font-size: 12px; background-color: #d1ecf1;">${this.getTotalPayableAmount().toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>`;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  }
}
