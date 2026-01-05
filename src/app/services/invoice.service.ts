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
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  // production
  private apiUrl = 'https://www.foodsted.com/khairlubricants/get_invoice';

  // following is for the local
    // private apiUrl = 'https://www.foodsted.com/khairlubricants/api/get_invoice';

  constructor(private http: HttpClient) {}

  getInvoiceDetails(invoiceId: string): Observable<InvoiceResponse> {
    const token = localStorage.getItem('khair_token');
    // const userId = localStorage.getItem('khair_user_id');

    // if (!token || !userId) {
    //   throw new Error('Authentication required');
    // }

    const formData = new FormData();
    formData.append('invoice_id', invoiceId);
    // formData.append('user_id', userId);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<InvoiceResponse>(this.apiUrl+'?invoice_id='+invoiceId);

    // followng will be sued in the lcoal systemr and the above will be sued in the producttion environment

      // return this.http.get<InvoiceResponse>(this.apiUrl+'?invoice_id='+invoiceId, { headers });

  }
}