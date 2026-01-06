import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InvoiceItem {
  item_code: string;
  item_name: string;
  item_unit: string;
  invoiced_qty: string;
  invoiced_rate: string;
  invoiced_pricewithoutdiscounttax: string;
  invoiced_totaldiscount: string;
  invoiced_totalsaletax: string;
  invoiced_totalvat: string;
  invoiced_netprice: string;
  item_id: string;
  isEmpty?: boolean; // Optional property for empty rows
}

export interface Invoice {
  invoice_submittedzatca: number;
  invoice_no: string;
  invoice_date: string;
  invoice_duedate: string;
  invoice_po: string;
  zpaymentmeanscode_id: string;
  zpaymentmeanscode_name: string;
  party_id: string;
  party_displayname: string;
  party_displayname_ar: string;
  party_address: string;
  party_building: string;
  party_street: string;
  party_district: string;
  party_city: string;
  party_country: string;
  party_postalcode: string;
  party_addno: string;
  party_ntn: string;
  party_crnum: string;
  invoice_id: number;
  branch_id: string;
  cmp_id: string;
}

export interface InvoiceResponse {
  invoice_id: number;
  invoice: Invoice;
  invoiced: InvoiceItem[];
  branch_result: BranchResult;
  qrcode_data: string;
}
export interface BranchResult {
  branch_id: number;
  branch_zstreetname: string;
  branch_zbuildingnum: string;
  branch_zcity: string;
  branch_zdistrict: string;
  branch_zpostalcode: string;
  branch_zvatnum: string;
  branch_zcrno: string;
  branch_zname: string;
  branch_zaddno: string;
  branch_zvatno: string;
}
export interface QRCode {
  qrcode_data: string; // Base64 ZATCA QR
}


@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  // production
  private apiUrl = 'https://www.foodsted.com/khairlubricants/get_invoice';

  constructor(private http: HttpClient) { }

  getInvoiceDetails(invoiceId: string): Observable<InvoiceResponse> {
    const token = localStorage.getItem('khair_token');


    const formData = new FormData();
    formData.append('invoice_id', invoiceId);
    // formData.append('user_id', userId);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<InvoiceResponse>(this.apiUrl + '?invoice_id=' + invoiceId);


  }
}