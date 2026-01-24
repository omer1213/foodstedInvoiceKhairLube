import { PurchaseReportComponent } from './../purchase-report/purchase-report';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PurchaseReportService {
  // this api will be used in local system

  private apiUrl = 'https://www.foodsted.com/khairlubricants/api/general';

  // this will be used with the production environment

  // private apiUrl = 'https://www.foodsted.com/khairlubricants/general';

  // TODO: Add your token here for local development
  private readonly LOCAL_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImZkMzMxMDQ0Njk2ZGYwYWYzMzczMzk4YzUyNzJmNDU1MmY5ZGNjZTc2NTNlMzYyZDViM2I5ZjRiMDVhZmQ0ZWNiY2FiZDJmOGVhODhmNmUzIn0.eyJhdWQiOiIzIiwianRpIjoiZmQzMzEwNDQ2OTZkZjBhZjMzNzMzOThjNTI3MmY0NTUyZjlkY2NlNzY1M2UzNjJkNWIzYjlmNGIwNWFmZDRlY2JjYWJkMmY4ZWE4OGY2ZTMiLCJpYXQiOjE3NjcyMDczMTksIm5iZiI6MTc2NzIwNzMxOSwiZXhwIjoxNzk4NzQzMzE5LCJzdWIiOiIxMDY1Iiwic2NvcGVzIjpbXX0.pSyP4i-CMhAlmF45gwsiO61JU1TN_KQLsVABT_Fls5ReGDt3axivrQ20phmjvEpmvihl0mQv7aSjZdFo7dZL_wGppgCUMCFpSIZUEevwtQBQiYIK86Vlkpgm1fMJQ7yP94gidfj_oT6_30qebGEZpXvLbJkqZ46KchbwgSgr7XbL85TSC4K80QMldd7FrBmfNksihUunC6eElMZ4FaKMHRqt2jDogz_EgnZ8nfac_XUUrXTdArweXgFTrQo6Fo2nUl9pL0vCbG7PVH4R_fFlF3hUBYIxzVjSAtB0RYjzQ5Y5xTggabE5miDr9IRNOGOHj1XevJ-iLAnT5y29ldQewgsUFCfUzHmEAdyfFlAJncV3fxnEcTCYqXEGwrofiWGzHJYoZOy-kvHflLyRuqheN-5EdQHlpuvFVGaYAhY_Kv8yuM86g2UAzT_5MzK4eS9wWTbMpRMC2enHkSnIf-7QOSULM2KGXj_UjcJdrrYyk0IEiFl45iDes7frGhSfFBxMFmYWYunp8jx2U24fvZv088mAITJPrNayUW-Av-T9I6eYByp0IqNeQN04sOWR-PII3tr92Wa7bspj9qIpTaSpa_xUCbRnaHDA6bf9BDalAudpX56JDCReU10RtsZodCN6M178VbNZGEnf4xDf6Y_3Q_xWqVMikkBMk10txI4sO90';

  // Set this to false when deploying to production
  private readonly IS_LOCAL = true;

  constructor(private http: HttpClient) { }

  getPurchaseReport(fromDate: string, toDate: string, getPurchaseReport: string = '1'): Observable<any> {
    // Set up query parameters
    const params = new HttpParams()
      .set('from_date', fromDate)
      .set('to_date', toDate)
      .set('get_purchasereport', getPurchaseReport);

    // Set up headers
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // FOR LOCAL ONLY - Comment out these 3 lines for production
    if (this.IS_LOCAL) {
      headers = headers.set('Authorization', `Bearer ${this.LOCAL_TOKEN}`);
    }

    // Make GET request without body (standard GET request)
    return this.http.get(this.apiUrl, {
      headers: headers,
      params: params
    }).pipe(
      tap(response => {
        console.log('Sales Report API Response:', response);
      })
    );
  }

  // Alternative method with date range as parameters
  getPurchaseReportByDateRange(fromDate: Date, toDate: Date, getPurchaseReport: string = '1'): Observable<any> {
    const fromDateStr = this.formatDate(fromDate);
    const toDateStr = this.formatDate(toDate);
    return this.getPurchaseReport(fromDateStr, toDateStr, getPurchaseReport);
  }

  // Helper method to format date as YYYY-MM-DD
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}