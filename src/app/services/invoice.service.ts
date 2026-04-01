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
  party_mobile:number;
  party_id: string;
  party_coacode:string;
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
  // private localUserId = '1095';

// user id for high tech
private localUserId = '1100';

  //user di for the khair 
  // private localUserId = '1022';
  //token of hund
  // private localAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImRlYzcwYmYxN2RhMWVlYTU5ZTViMzlkNDc5OGU1ZWM1N2VlZDNhMGYwNGRjMmNhNzFkZDllZDMyZTdhOTdhOGU3Yjg3ZmViMjg4NjY5M2VkIn0.eyJhdWQiOiIzIiwianRpIjoiZGVjNzBiZjE3ZGExZWVhNTllNWIzOWQ0Nzk4ZTVlYzU3ZWVkM2EwZjA0ZGMyY2E3MWRkOWVkMzJlN2E5N2E4ZTdiODdmZWIyODg2NjkzZWQiLCJpYXQiOjE3NzUwMzQ5NzYsIm5iZiI6MTc3NTAzNDk3NiwiZXhwIjoxODA2NTcwOTc2LCJzdWIiOiIxMTQ1Iiwic2NvcGVzIjpbXX0.YIwjzbeG5VChdPOdcqySxrJuAMeMBfs0qcA0mHo4l3IZTXCr0kdXeL04IT5ymEwRWn5RnleWu7mtYbREBQW3Hu7UEWDhFr-yol8Ri9TAWAMTRmtchwZUlr8RpVmZaLTXqhvXOa5iJpW2IF1fzcjpgQRD3W-3DL-F0JQwV3p7go1N5fydaOu5dp_tiRUHP1NdDdyuqLSG_mYKKtCF07JM73kmAiskijRufwUcF_nKlOVbcgJrSGggo17tpF7juXPz2X0M9Qh22vRBYNfheRkRknK1r0eniG3vGppe31N3rDRCKYqlrh0NffmhDupUUXHPGjL7YVEF19N2ys0Mr45X-GkjIM9o0i45sIBSKA3g5sDIktH6DpJZV58MX9nd9vpJ1rBQRLVmVm4DeMc6gCq6Q1vb1sMZLJGCK5mJkpMrjit3_-6OWdiJlQEJ2ZiPUzZBzRFOANNcGcy-tb-uFE6lH3Y-omQluSwSFF_GzNkx4eFK13xEJn_6rLeG8y1hFurwmBeViyCZWfjF62ZVV7ort-m16N_sYoWcAGlWOAdjcrbn60XDCFArWyTD3Qst6sNiDLcM2ml8pkhY-RmKeyo4kQRnBJwYicrDtdlQvvwyrqhlL-G2IBETsgsrEJkcK4X0G31WBPPgzu6ZAS4z0N5QfvQ0Dna7OH94MXriOgtZOh0';
  // token of high tech
   private localAuthToken ='eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjJkYjM1YzE0ZDFiOTkwZjE4Njc1OTdiZGJjMjU5ZjBkZTA2YTljYzk5ZTY3Mzc2ZWJiNzY5NmUyZmY0MWEyYjJlNWY2NGY5MmFhOGY1ZDdiIn0.eyJhdWQiOiIzIiwianRpIjoiMmRiMzVjMTRkMWI5OTBmMTg2NzU5N2JkYmMyNTlmMGRlMDZhOWNjOTllNjczNzZlYmI3Njk2ZTJmZjQxYTJiMmU1ZjY0ZjkyYWE4ZjVkN2IiLCJpYXQiOjE3NzUwMzUxMzgsIm5iZiI6MTc3NTAzNTEzOCwiZXhwIjoxODA2NTcxMTM4LCJzdWIiOiIxMTQ0Iiwic2NvcGVzIjpbXX0.gRobXCt8HlKbbs-sCdmOSOwTWhbSlHFxv2e1RoTF8XHwlAYg7hHsoAne1HNqc27bGQAn1vLCF7v03emTbqlireROpRayHGgRd7T5tDrCj3nClN-7qP2wiNAL0P0T5hLDbO5AobJhCepnIfqqC12oPcJAEy6oMsZXM1wp5vc1NgmoFOk21gz2cNDq3lDPbOhKfAsFbTgv32BC8_GgdKDlKnf-Pgi0tkGeic9mVHyLXV2gG5HGsl7r0TYXZ5IOSo185aLjxNhmsOm3cPbfZSUrr5wtUSjvXUezERMNQjURHwGw0GjTgnioPelol2r0TJvg48quolGNaF_dOZQSi4fyYPH5OIom2i_NAOI6A5V0Xy7m1IdR2LiYc2J5CDrF9KF4ypOPiYUqxUNNv1HOhOdkxjWtkGVvmMytnERrw8bvFaxSNkXkdxbSPxCG6TcTV8fUfr1WbrLuZv0KeWuugIQ9xWWO0YfbCZ1Tate8vh1JbgsPQc-4225EAZ3No5nt_X1bLEgIpA_HMuM_H_VApvN7cBtnksBunnseaCSJLcrAOVgJ-rHwNctksaXKvmJRtxNj5M4WQhIOeA5_Fh7cRhwh0K86nli_IpKzls1eUvXAayIqqNc5oxiOqbBEB-oplIus3T-s_OUR8Zj0lNqU_p9YbaIGVdVpE8rnP6BAXVzc-U0'
  //token of khair
  //  private localAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjUyYjA2Y2VhZWY3ZmE2NDJlNDMxNTEyMTg0ODNlZTg1MjQ3NjQ0ODY0OWRiM2FiMjNlMGE4NjIzMTY0MTMyYTlhY2JhNTQwMzFjYzQzMDRmIn0.eyJhdWQiOiIzIiwianRpIjoiNTJiMDZjZWFlZjdmYTY0MmU0MzE1MTIxODQ4M2VlODUyNDc2NDQ4NjQ5ZGIzYWIyM2UwYTg2MjMxNjQxMzJhOWFjYmE1NDAzMWNjNDMwNGYiLCJpYXQiOjE3Njk2ODk3NTAsIm5iZiI6MTc2OTY4OTc1MCwiZXhwIjoxODAxMjI1NzUwLCJzdWIiOiIxMDY1Iiwic2NvcGVzIjpbXX0.Cf8V1aylo1IEazBKg4znLKSTGWY5jYP6IoKGqx9tUDTSd7acno3ykISmavjtgJlIoTUJ3PFRGwQAK3klhS2hKYqfcq35--J294yLCjfimV7Th7qEvlKWBhf4VVjhcIagtu1PvXFf-daRd3FCtkTV0ywRRPj1gDFkzsNPUcu9awvazbVWxmO6F7qvBIK3tATlUr7K2fFEs0ia-y3ghXcH_KXCCmX61izhXZ9SrxX7qG-05vYLhU1WQB_6M6SD21w3AICoIVPcNBKVTvCRhtUkXdd691libU0ZBfruNkGG9DArn2aFf-JJVWQALkQ9NtQmo-X1cUq5rV30pf7KjEQQvc1fr03rRiwP-6QkYD7uuInf4mFe0sgObf43QHqWrBtqvvSRTgXr7HiytZlAPXKLPPIGNLpFQqdbtACSQisGnQ8L-AWwCkO_dl3vnvvV-v8Ngyac9i1sip7kfKCxJY-fM03xiEnnG-Eidf3bbDYz32O7pgSAhu-64EGBQMHPOyFHuwf7knpTDg3pUlhaH5VNPrVMWOHKD-HocDWmZbyvVN6cH0EQnbuGziD52dVpJRNneYkgD9MViAnWiCdM22eOZ8raIaoWLUDqXMDbVald_LS-PePU0IrIHwyhqtIUbhwHR7eRQFo-AFYl5yKoTWT2TxhxHG8CYJ-DsMjXSZsyT-4'
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