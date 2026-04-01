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
  party_mobile: number;
  party_id: string;
  party_coacode: string;
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
  private isDevelopment = false; // Set to true for local development, false for production
  //user if for hund
  // private localUserId = '1095';

  // user id for high tech
  private localUserId = '1100';

  //user di for the khair 
  // private localUserId = '1022';
  //token of hund
  // private localAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImRlYzcwYmYxN2RhMWVlYTU5ZTViMzlkNDc5OGU1ZWM1N2VlZDNhMGYwNGRjMmNhNzFkZDllZDMyZTdhOTdhOGU3Yjg3ZmViMjg4NjY5M2VkIn0.eyJhdWQiOiIzIiwianRpIjoiZGVjNzBiZjE3ZGExZWVhNTllNWIzOWQ0Nzk4ZTVlYzU3ZWVkM2EwZjA0ZGMyY2E3MWRkOWVkMzJlN2E5N2E4ZTdiODdmZWIyODg2NjkzZWQiLCJpYXQiOjE3NzUwMzQ5NzYsIm5iZiI6MTc3NTAzNDk3NiwiZXhwIjoxODA2NTcwOTc2LCJzdWIiOiIxMTQ1Iiwic2NvcGVzIjpbXX0.YIwjzbeG5VChdPOdcqySxrJuAMeMBfs0qcA0mHo4l3IZTXCr0kdXeL04IT5ymEwRWn5RnleWu7mtYbREBQW3Hu7UEWDhFr-yol8Ri9TAWAMTRmtchwZUlr8RpVmZaLTXqhvXOa5iJpW2IF1fzcjpgQRD3W-3DL-F0JQwV3p7go1N5fydaOu5dp_tiRUHP1NdDdyuqLSG_mYKKtCF07JM73kmAiskijRufwUcF_nKlOVbcgJrSGggo17tpF7juXPz2X0M9Qh22vRBYNfheRkRknK1r0eniG3vGppe31N3rDRCKYqlrh0NffmhDupUUXHPGjL7YVEF19N2ys0Mr45X-GkjIM9o0i45sIBSKA3g5sDIktH6DpJZV58MX9nd9vpJ1rBQRLVmVm4DeMc6gCq6Q1vb1sMZLJGCK5mJkpMrjit3_-6OWdiJlQEJ2ZiPUzZBzRFOANNcGcy-tb-uFE6lH3Y-omQluSwSFF_GzNkx4eFK13xEJn_6rLeG8y1hFurwmBeViyCZWfjF62ZVV7ort-m16N_sYoWcAGlWOAdjcrbn60XDCFArWyTD3Qst6sNiDLcM2ml8pkhY-RmKeyo4kQRnBJwYicrDtdlQvvwyrqhlL-G2IBETsgsrEJkcK4X0G31WBPPgzu6ZAS4z0N5QfvQ0Dna7OH94MXriOgtZOh0';
  // token of high tech
  private localAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjZjZTZiNzQzNjVmYWExZmQzZWI4M2Q1ZWQwOWQ5MjY1OTM0ZmZlMzZjNGJlZDkxMTg5MWE1YTU2NWM4YmIyY2U2YTE3ZDU5NGQ1MWJiZmI2In0.eyJhdWQiOiIzIiwianRpIjoiNmNlNmI3NDM2NWZhYTFmZDNlYjgzZDVlZDA5ZDkyNjU5MzRmZmUzNmM0YmVkOTExODkxYTVhNTY1YzhiYjJjZTZhMTdkNTk0ZDUxYmJmYjYiLCJpYXQiOjE3NzUwMzk2NDMsIm5iZiI6MTc3NTAzOTY0MywiZXhwIjoxODA2NTc1NjQzLCJzdWIiOiIxMTQ0Iiwic2NvcGVzIjpbXX0.geFpwhSBsmzlowN-bqlMxZzSEKhvlSBoCu9mTO57zVdMekcfJCoQw54shrdbL7Hv0v3A65KL-N41-G3JdFXziY3wfHMAzn8uVCn1z7pyQW7_XJ5PwS1qd_VxULOwTdBqY6pH5aLkAA1TDsn4tdC2fR6uvfEBaDGxkuZnfp3F9PICjPWyIfMAZDVbChe6knFO8exCMFF7cSlaqAr7CBgPEhhUY3qS4Q9c46BleZdtSE7uRI8J2U0yTDC7_3gOmY7BqFhkjBuY_qBbfiZmtdngO5LGGmXu-KKBjeyT13Avua0YLfr2YM0j6utXIS16BPduVzrIqx-rmFUdkNiAWawyNRQf2fh8RRoh433WIJQMvSCn8ClpaqPdYJ9_TvS3S4lETbvQh6Ms0RwA_tOOscihrX8fRLgBR4xa4weGff_0F0_SXHUVUNIOeg_GjzB9uPpWROGCzm42vDbp2ApTCcxwq1n5VdvWoeDDHa-lnUzMPY9-wmtj5qEph9fKxHGQBoB2pbLGW42XaEd_zDMKVAn5ZsDV6OIKg6PG4YWLisz3dXJr01OBmMtl2CgvAqyVFOSgfNectfIH2htOWv3nHwIKvuDg7b3h7mTA1kwc5qZAMweS-zFK_irAUR688uvW8ecNZTHnc-crmi5IrgMOXbDfU-bmOz4pr5vDnkNHWup84rg'
  //token of khair
  // private localAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImU5NDUyMjYyZjgwYmFlZWRhMDY2NTUxNWU4NThmYTU3ZTZmMmYyNDc4MjUwYzM2NTllZTU1ZTVhZmFlYzg5OGRiYTZiYWQ0ZGE5YjRlN2E2In0.eyJhdWQiOiIzIiwianRpIjoiZTk0NTIyNjJmODBiYWVlZGEwNjY1NTE1ZTg1OGZhNTdlNmYyZjI0NzgyNTBjMzY1OWVlNTVlNWFmYWVjODk4ZGJhNmJhZDRkYTliNGU3YTYiLCJpYXQiOjE3NzUwNDQyMzUsIm5iZiI6MTc3NTA0NDIzNSwiZXhwIjoxODA2NTgwMjM1LCJzdWIiOiIxMDY1Iiwic2NvcGVzIjpbXX0.rnlwpsyehdv2By-VPXxaecMSBr4CzGxsLAmdsFmdEvDJ0o12sh7SaieCsc6I3f1bpPYykyVYwujJbtYT24lM0m7NdS7rd05VlgbsyJy6muyRgO8b_nIBSOKlwtqrQdSc0huhyYSmM9UzbQxSMe1rLTSqDvuy8xX3-Ah6RzbFMw0lXjH5U2inLbmN9T0ppczhZw3sofTpnZNztz5-qAw9NPhJap6a5y9S8XhFUkA_EgWjT0sCDOpiVtdVXvdXxSgn1uaCDRg8Y5e7p06AL_P50ym5jMwCsYshPHZphfDscw8idI3QtQSYceYLY7Bs7Yae5QiIzvbVcce4CqJT6jF0uE7Jk8Gravna9ckEOyJH3N9PUhGVXSrE5kvw5gwwpKmYLKN3sl7GY56VmeZy50b76J3734zVvtUu1TzQ9U9IOhiRtgrl0d1gljPsQFq8eYM-kEO4mJ5XtE1T6FqdJLlT4BOEIs8gZny0JXegCxYQvEcA_XFVOu04KmSeiW-SoFZnXow3FdnV2zktxzBa7l7_S-ufw7_80iu1ZBMLxbhWIJeYWFNAaERkH49UkjJ8k1q-K8QY9g4SqvKx8vgMLGHDYWSOtKTBEGelkvq6bfxL_I06JkLu8kqQKiClEmgyDk2X5xMjeSasfPsK7NCiVB3jkS3AWB0vqsFshGP2mrq_6JQ'
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