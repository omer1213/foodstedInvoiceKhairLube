import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export interface Item {
  item_id: string;
  item_picture: string;
  item_code: string;
  item_name: string;
  item_unit: string;
  item_cost: string;
  item_tax: string;
  item_vat: string;
  item_rate: string;
}

export interface Category {
  lookupdetail_id: number;
  lookupmaster_majorcode: string;
  lookupdetail_minorcode: string;
  lookupdetail_level: string;
  lookupdetail_parentid: string;
  lookupdetail_parentcode: string | null;
  lookupdetail_title: string;
  lookupdetail_title_ur: string | null;
  lookupdetail_title_no: string | null;
  lookupdetail_title_es: string | null;
  lookupdetail_title_ar: string | null;
  lookupdetail_description: string;
  lookupdetail_active: string;
  lookupdetail_popular: string;
  lookupdetail_value1: string | null;
  lookupdetail_value2: string | null;
  lookupdetail_value3: string | null;
  lookupdetail_value4: string | null;
  lookupdetail_value5: string | null;
  lookupdetail_img: string | null;
  user_id: string;
  cmp_id: string;
  created_at: string;
  updated_at: string;
}

export interface ItemsResponse {
  cmp_allowvat: number;
  cmp_allowtax: number;
  cmp_activelotno: number;
  items_list: Item[];
  categories_list: Category[];
  where_condition: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private readonly BASE_API_URL = 'https://www.foodsted.com/khairlubricants/api/itemlist';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  async getItems(): Promise<ItemsResponse> {
    const token = this.authService.getToken();
    const userId = this.authService.getUserId();
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    if (!userId) {
      throw new Error('User ID not found');
    }

    // Build URL with user_id query parameter
    const apiUrl = `${this.BASE_API_URL}?user_id=${userId}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const response = await firstValueFrom(
        this.http.get<ItemsResponse>(apiUrl, { headers })
      );
      
      return response;
    } catch (error: any) {
      if (error.status === 401) {
        // Clear all authentication data and redirect to login
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/login']);
        throw new Error('Session expired. Please login again.');
      } else if (error.status === 403) {
        throw new Error('Access denied. Insufficient permissions.');
      } else {
        throw new Error('Failed to load items. Please try again.');
      }
    }
  }
}