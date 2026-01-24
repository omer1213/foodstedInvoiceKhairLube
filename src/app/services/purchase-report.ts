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
  private readonly LOCAL_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImFmZmUyOWM2NjkxZGY0MmI2M2ZjMGViMGUwMDhmODhjZDRmZmNkNDk2YzRjZTdiMTZhNGE3Y2JlMTJhZGMzZjVkODhmMWVhY2NhNjkxMjYyIn0.eyJhdWQiOiIzIiwianRpIjoiYWZmZTI5YzY2OTFkZjQyYjYzZmMwZWIwZTAwOGY4OGNkNGZmY2Q0OTZjNGNlN2IxNmE0YTdjYmUxMmFkYzNmNWQ4OGYxZWFjY2E2OTEyNjIiLCJpYXQiOjE3NjkxODk4NjksIm5iZiI6MTc2OTE4OTg2OSwiZXhwIjoxODAwNzI1ODY5LCJzdWIiOiIxMTc2Iiwic2NvcGVzIjpbXX0.AJlOiAa97IdOo4LxwIQeQd8CiRwXfcDHd4ry3eilLLUonGxDK5noto1Ff8V6fkDl5VSX9mL_ATOcIR0RogCfNHy9z0qOmVmbILUSXfpbEjOTrMO-rNyqv0LUYTCIJ3-rpeH_kSDbOj76CD_J-uDDsWg6DY95bDP2Ov3kKaPIPgIl-r1gipleASUmHV4N9t0Dj-Cst-90Ch-JAAP271Tc5pUV5d4llqEnetpuyPp3ss4y-kKJHI4CcDSIXO09n_o08G_pIDiE0ZV2yhsOp-HtLSoZYZmQdBS4iLp8CDMPkG9_vJ4iwpQEta6xFv84sxtC8m7-IG8slDLgYNGssm1hQWa3D-2XS1dTsnLEZy16HAuQ6hNPjP7kryuOKuUmiDyqRoORu-O6AfNkxfNPxvk5CjzviqLbwpuJAdGnVoTMN9Kdvu4cT84EiPLZAqQj8e_tnV3MYDCW6aYEEJnQuTJDWA9sICFnsTEiqohMSZg9Zkr-ieMIPSmxIl5_KdcnmMb4Ydl84cJjy4zAjyUAEJYBBQPVzDo9I8DtPaEbbcGJSJwiXFtWR0Gs8G_D_Jlrne4LITwR2dXGJIFD-vfNiNhya-vTDSrARdIe5nGBdCBn0-BZaA615W1CZdROKpeSwsXKX2UewCVVrO00WWek_KVK7Xt95ttkiwfzIyuuV9NI9-Q';

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