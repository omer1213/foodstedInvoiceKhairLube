// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';

// export interface InvoiceItem {
//   item_code: string;
//   item_name: string;
//   item_unit: string;
//   invoiced_qty: string;
//   invoiced_rate: string;
//   invoiced_pricewithoutdiscounttax: string;
//   invoiced_totaldiscount: string;
//   invoiced_totalsaletax: string;
//   invoiced_totalvat: string;
//   invoiced_netprice: string;
//   item_id: string;
//   isEmpty?: boolean; // Optional property for empty rows
// }

// export interface Invoice {
//   invoice_submittedzatca: number;
//   invoice_no: string;
//   invoice_date: string;
//   invoice_duedate: string;
//   invoice_po: string;
//   zpaymentmeanscode_id: string;
//   zpaymentmeanscode_name: string;
//   party_id: string;
//   party_displayname: string;
//   party_displayname_ar: string;
//   party_address: string;
//   party_building: string;
//   party_street: string;
//   party_district: string;
//   party_city: string;
//   party_country: string;
//   party_postalcode: string;
//   party_addno: string;
//   party_ntn: string;
//   party_crnum: string;
//   invoice_id: number;
//   branch_id: string;
//   cmp_id: string;
// }

// export interface InvoiceResponse {
//   invoice_id: number;
//   invoice: Invoice;
//   invoiced: InvoiceItem[];
//   branch_result: BranchResult;
//   qrcode_data: string;
// }
// export interface BranchResult {
//   branch_id: number;
//   branch_zstreetname: string;
//   branch_zbuildingnum: string;
//   branch_zcity: string;
//   branch_zdistrict: string;
//   branch_zpostalcode: string;
//   branch_zvatnum: string;
//   branch_zcrno: string;
//   branch_zname: string;
//   branch_zaddno: string;
//   branch_zvatno: string;
// }
// export interface QRCode {
//   qrcode_data: string; // Base64 ZATCA QR
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class InvoiceService {
//   private apiUrl = 'https://www.foodsted.com/khairlubricants/get_invoice';

//   constructor(private http: HttpClient) { }

//   getInvoiceDetails(invoiceId: string): Observable<InvoiceResponse> {
//     return this.http.get<InvoiceResponse>(`${this.apiUrl}?invoice_id=${invoiceId}`, { withCredentials: true });
//   }
// }


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
  private apiUrl = 'https://www.foodsted.com/khairlubricants/get_invoice';
  private localApiUrl = 'https://www.foodsted.com/khairlubricants/api/get_invoice';
  private isDevelopment = true; // Set to true for local development, false for production
  //user if for hund
  private localUserId = '1095';

  //user di for the khair 
  // private localUserId = '1022';
  //token of hund
<<<<<<< HEAD
  // private localAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImZiODAwYjhlM2VmYzc1ODc4ZDRmZTMzN2Y2YTQyZDkyMWY5MDhkNzg0MzYyMGM4OWM0ZTc2MDIwYTUxYmQzMjQzODQ3ODIyNjBhM2ZhN2I1In0.eyJhdWQiOiIzIiwianRpIjoiZmI4MDBiOGUzZWZjNzU4NzhkNGZlMzM3ZjZhNDJkOTIxZjkwOGQ3ODQzNjIwYzg5YzRlNzYwMjBhNTFiZDMyNDM4NDc4MjI2MGEzZmE3YjUiLCJpYXQiOjE3Njk2OTMzMDgsIm5iZiI6MTc2OTY5MzMwOCwiZXhwIjoxODAxMjI5MzA4LCJzdWIiOiIxMTQ1Iiwic2NvcGVzIjpbXX0.PTlqfbuZtuH1X8HR8Q81ij8zIx35eHELghlgn3A0ttvgAIWNcG_aE6u_X6OfoCMZ5cVVmPqCuxxNSfR0OCOm6iFySHVlDk4Qs24phZRFIlufy5d13QwkwIbVxa2C_0ZDaq-PvP7CCIuO9V8DhPtcemG8XQUImtYMkB1bLfuq3b-XW4bYDB-vKV-Jqh7WyvHGb2FZ1NCjpVzDUyQpSJBR8WNSxXVvrO6M7n7lv5IGGiNFDQjaboxbMSCaBMj9WbhWFQCwqhgtgAgfNqaRxTCItZhrCGx153xGVkXqkqrrfK8KJRvO-blY6xg6wriFCswd2jqV7fvJoLeEFEi5bkt48ZewbHdaAhUH4ntj7087BHLnvykFcyftEmAhq7O3zqHnH0AqOsNjsUutnRLMCdPZEx0wY14RriNbo0La6aQ28ytX3HBIpIHsaW22lFP9BhNeCErZqwYZPT9QDLlIqeIgKiuIZjKwbam5sF03ukh0fJO4y6gliASnKvyWGrU7u0D5rWONOOgBXsiC6uPNuuWwqeI1nPnaih3yOx8ormgHdQCi5dqhWLNZLXXmh4O4pehOo6MyCmCTIpIBaeHr0RM655lgkh9zAge7dHn8Z4xrzu2Qcrny8LpCi9fLLlBsk19EAShQnHvpUJmZiNUm9S7CBrFduzh9r1K58AbYYe6gNdc';
  //token of khair
   private localAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjUyYjA2Y2VhZWY3ZmE2NDJlNDMxNTEyMTg0ODNlZTg1MjQ3NjQ0ODY0OWRiM2FiMjNlMGE4NjIzMTY0MTMyYTlhY2JhNTQwMzFjYzQzMDRmIn0.eyJhdWQiOiIzIiwianRpIjoiNTJiMDZjZWFlZjdmYTY0MmU0MzE1MTIxODQ4M2VlODUyNDc2NDQ4NjQ5ZGIzYWIyM2UwYTg2MjMxNjQxMzJhOWFjYmE1NDAzMWNjNDMwNGYiLCJpYXQiOjE3Njk2ODk3NTAsIm5iZiI6MTc2OTY4OTc1MCwiZXhwIjoxODAxMjI1NzUwLCJzdWIiOiIxMDY1Iiwic2NvcGVzIjpbXX0.Cf8V1aylo1IEazBKg4znLKSTGWY5jYP6IoKGqx9tUDTSd7acno3ykISmavjtgJlIoTUJ3PFRGwQAK3klhS2hKYqfcq35--J294yLCjfimV7Th7qEvlKWBhf4VVjhcIagtu1PvXFf-daRd3FCtkTV0ywRRPj1gDFkzsNPUcu9awvazbVWxmO6F7qvBIK3tATlUr7K2fFEs0ia-y3ghXcH_KXCCmX61izhXZ9SrxX7qG-05vYLhU1WQB_6M6SD21w3AICoIVPcNBKVTvCRhtUkXdd691libU0ZBfruNkGG9DArn2aFf-JJVWQALkQ9NtQmo-X1cUq5rV30pf7KjEQQvc1fr03rRiwP-6QkYD7uuInf4mFe0sgObf43QHqWrBtqvvSRTgXr7HiytZlAPXKLPPIGNLpFQqdbtACSQisGnQ8L-AWwCkO_dl3vnvvV-v8Ngyac9i1sip7kfKCxJY-fM03xiEnnG-Eidf3bbDYz32O7pgSAhu-64EGBQMHPOyFHuwf7knpTDg3pUlhaH5VNPrVMWOHKD-HocDWmZbyvVN6cH0EQnbuGziD52dVpJRNneYkgD9MViAnWiCdM22eOZ8raIaoWLUDqXMDbVald_LS-PePU0IrIHwyhqtIUbhwHR7eRQFo-AFYl5yKoTWT2TxhxHG8CYJ-DsMjXSZsyT-4'
=======
  private localAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImZiODAwYjhlM2VmYzc1ODc4ZDRmZTMzN2Y2YTQyZDkyMWY5MDhkNzg0MzYyMGM4OWM0ZTc2MDIwYTUxYmQzMjQzODQ3ODIyNjBhM2ZhN2I1In0.eyJhdWQiOiIzIiwianRpIjoiZmI4MDBiOGUzZWZjNzU4NzhkNGZlMzM3ZjZhNDJkOTIxZjkwOGQ3ODQzNjIwYzg5YzRlNzYwMjBhNTFiZDMyNDM4NDc4MjI2MGEzZmE3YjUiLCJpYXQiOjE3Njk2OTMzMDgsIm5iZiI6MTc2OTY5MzMwOCwiZXhwIjoxODAxMjI5MzA4LCJzdWIiOiIxMTQ1Iiwic2NvcGVzIjpbXX0.PTlqfbuZtuH1X8HR8Q81ij8zIx35eHELghlgn3A0ttvgAIWNcG_aE6u_X6OfoCMZ5cVVmPqCuxxNSfR0OCOm6iFySHVlDk4Qs24phZRFIlufy5d13QwkwIbVxa2C_0ZDaq-PvP7CCIuO9V8DhPtcemG8XQUImtYMkB1bLfuq3b-XW4bYDB-vKV-Jqh7WyvHGb2FZ1NCjpVzDUyQpSJBR8WNSxXVvrO6M7n7lv5IGGiNFDQjaboxbMSCaBMj9WbhWFQCwqhgtgAgfNqaRxTCItZhrCGx153xGVkXqkqrrfK8KJRvO-blY6xg6wriFCswd2jqV7fvJoLeEFEi5bkt48ZewbHdaAhUH4ntj7087BHLnvykFcyftEmAhq7O3zqHnH0AqOsNjsUutnRLMCdPZEx0wY14RriNbo0La6aQ28ytX3HBIpIHsaW22lFP9BhNeCErZqwYZPT9QDLlIqeIgKiuIZjKwbam5sF03ukh0fJO4y6gliASnKvyWGrU7u0D5rWONOOgBXsiC6uPNuuWwqeI1nPnaih3yOx8ormgHdQCi5dqhWLNZLXXmh4O4pehOo6MyCmCTIpIBaeHr0RM655lgkh9zAge7dHn8Z4xrzu2Qcrny8LpCi9fLLlBsk19EAShQnHvpUJmZiNUm9S7CBrFduzh9r1K58AbYYe6gNdc';
  //token of khair
  // private localAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjUyYjA2Y2VhZWY3ZmE2NDJlNDMxNTEyMTg0ODNlZTg1MjQ3NjQ0ODY0OWRiM2FiMjNlMGE4NjIzMTY0MTMyYTlhY2JhNTQwMzFjYzQzMDRmIn0.eyJhdWQiOiIzIiwianRpIjoiNTJiMDZjZWFlZjdmYTY0MmU0MzE1MTIxODQ4M2VlODUyNDc2NDQ4NjQ5ZGIzYWIyM2UwYTg2MjMxNjQxMzJhOWFjYmE1NDAzMWNjNDMwNGYiLCJpYXQiOjE3Njk2ODk3NTAsIm5iZiI6MTc2OTY4OTc1MCwiZXhwIjoxODAxMjI1NzUwLCJzdWIiOiIxMDY1Iiwic2NvcGVzIjpbXX0.Cf8V1aylo1IEazBKg4znLKSTGWY5jYP6IoKGqx9tUDTSd7acno3ykISmavjtgJlIoTUJ3PFRGwQAK3klhS2hKYqfcq35--J294yLCjfimV7Th7qEvlKWBhf4VVjhcIagtu1PvXFf-daRd3FCtkTV0ywRRPj1gDFkzsNPUcu9awvazbVWxmO6F7qvBIK3tATlUr7K2fFEs0ia-y3ghXcH_KXCCmX61izhXZ9SrxX7qG-05vYLhU1WQB_6M6SD21w3AICoIVPcNBKVTvCRhtUkXdd691libU0ZBfruNkGG9DArn2aFf-JJVWQALkQ9NtQmo-X1cUq5rV30pf7KjEQQvc1fr03rRiwP-6QkYD7uuInf4mFe0sgObf43QHqWrBtqvvSRTgXr7HiytZlAPXKLPPIGNLpFQqdbtACSQisGnQ8L-AWwCkO_dl3vnvvV-v8Ngyac9i1sip7kfKCxJY-fM03xiEnnG-Eidf3bbDYz32O7pgSAhu-64EGBQMHPOyFHuwf7knpTDg3pUlhaH5VNPrVMWOHKD-HocDWmZbyvVN6cH0EQnbuGziD52dVpJRNneYkgD9MViAnWiCdM22eOZ8raIaoWLUDqXMDbVald_LS-PePU0IrIHwyhqtIUbhwHR7eRQFo-AFYl5yKoTWT2TxhxHG8CYJ-DsMjXSZsyT-4'
>>>>>>> f591c6b5ab12a5170031fa86981b67c50b6cad5e
  constructor(private http: HttpClient) { }

  getInvoiceDetails(invoiceId: string): Observable<InvoiceResponse> {
    if (this.isDevelopment) {
      return this.getInvoiceDetailsLocal(invoiceId);
    } else {
      return this.getInvoiceDetailsProduction(invoiceId);
    }
  }

  private getInvoiceDetailsProduction(invoiceId: string): Observable<InvoiceResponse> {
    return this.http.get<InvoiceResponse>(`${this.apiUrl}?invoice_id=${invoiceId}`, { withCredentials: true });
  }

  private getInvoiceDetailsLocal(invoiceId: string): Observable<InvoiceResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.localAuthToken}`
    });
    return this.http.get<InvoiceResponse>(
      `${this.localApiUrl}?invoice_id=${invoiceId}&user_id=${this.localUserId}`,
      { headers }
    );
  }
}