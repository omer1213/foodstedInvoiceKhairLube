import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface User {
  user_id: number;
  success: number;
  token: string;
  default_supplier_id: number;
  default_supplier_coacode: string;
  default_supplier_displayname: string;
}

export interface LoginResponse {
  user_id: number;
  success: number;
  token: string;
  default_supplier_id: number;
  default_supplier_coacode: string;
  default_supplier_displayname: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUser = signal<User | null>(null);
  private readonly isAuthenticated = signal(false);
  private readonly API_URL = 'https://www.foodsted.com/khairlubricants/api/login';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    // Check if user is already logged in on service initialization
    this.checkStoredAuth();
  }

  // Getters for reactive state
  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  getIsAuthenticated() {
    return this.isAuthenticated.asReadonly();
  }

  private checkStoredAuth() {
    const storedUser = localStorage.getItem('khair_user');
    const storedToken = localStorage.getItem('khair_token');
    const storedUserId = localStorage.getItem('khair_user_id');
    
    if (storedUser && storedToken && storedUserId) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearStoredAuth();
      }
    }
  }

  private clearStoredAuth() {
    // Clear all authentication data from both localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  // Real API login method
  async login(email: string, password: string): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await firstValueFrom(
        this.http.post<LoginResponse>(this.API_URL, formData)
      );

      if (response.success === 1) {
        // Store all user data in localStorage
        localStorage.setItem('khair_user', JSON.stringify(response));
        localStorage.setItem('khair_token', response.token);
        localStorage.setItem('khair_user_id', response.user_id.toString());
        
        // Update reactive state
        this.currentUser.set(response);
        this.isAuthenticated.set(true);
        
        // Show welcome popup
        this.showWelcomePopup(response.default_supplier_displayname);
        
      } else {
        throw new Error('Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.status === 401 || error.status === 422) {
        // Clear any existing session data on authentication failure
        localStorage.clear();
        sessionStorage.clear();
        throw new Error('Invalid email or password. Please try again.');
      } else if (error.status === 0) {
        throw new Error('Network error. Please check your internet connection.');
      } else {
        throw new Error('Login failed. Please try again later.');
      }
    }
  }

  private showWelcomePopup(displayName: string) {
    // Create and show welcome popup
    const popup = document.createElement('div');
    popup.className = 'welcome-popup';
    popup.innerHTML = `
      <div class="welcome-popup-content">
        <div class="welcome-icon">🎉</div>
        <h2>Welcome ${displayName}!</h2>
        <p>You have successfully logged in to the system.</p>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .welcome-popup {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
      }
      .welcome-popup-content {
        background: white;
        padding: 30px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        max-width: 400px;
        margin: 20px;
        animation: slideIn 0.3s ease;
      }
      .welcome-icon {
        font-size: 48px;
        margin-bottom: 15px;
      }
      .welcome-popup-content h2 {
        color: #2c3e50;
        margin: 0 0 10px 0;
        font-size: 24px;
      }
      .welcome-popup-content p {
        color: #7f8c8d;
        margin: 0;
        font-size: 16px;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(popup);
    
    // Auto-remove popup after 3 seconds
    setTimeout(() => {
      if (popup && popup.parentNode) {
        popup.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => {
          popup.remove();
          style.remove();
        }, 300);
      }
    }, 3000);
    
    // Remove popup on click
    popup.addEventListener('click', () => {
      popup.style.animation = 'fadeIn 0.3s ease reverse';
      setTimeout(() => {
        popup.remove();
        style.remove();
      }, 300);
    });
  }

  logout(): void {
    this.clearStoredAuth();
    this.router.navigate(['/login']);
  }

  // Method to get the auth token for API requests
  getToken(): string | null {
    return localStorage.getItem('khair_token');
  }

  // Method to get user ID
  getUserId(): string | null {
    return localStorage.getItem('khair_user_id');
  }

  // Method to check if token is valid (implement based on your token structure)
  isTokenValid(): boolean {
    const token = this.getToken();
    const user = this.currentUser();
    return !!(token && user && user.success === 1);
  }

  // Public method to restore authentication state from localStorage
  restoreAuthState(): boolean {
    const storedUser = localStorage.getItem('khair_user');
    const storedToken = localStorage.getItem('khair_token');
    const storedUserId = localStorage.getItem('khair_user_id');
    
    if (storedUser && storedToken && storedUserId) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        return true;
      } catch (error) {
        this.clearStoredAuth();
        return false;
      }
    }
    return false;
  }
}