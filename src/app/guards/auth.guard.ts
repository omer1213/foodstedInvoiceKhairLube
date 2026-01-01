import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Simple check - if we have token and user data, allow access
    const token = localStorage.getItem('khair_token');
    const userData = localStorage.getItem('khair_user');
    
    console.log('AuthGuard - Token exists:', !!token);
    console.log('AuthGuard - User data exists:', !!userData);
    
    if (token && userData) {
      console.log('AuthGuard - Access GRANTED');
      return true;
    }
    
    console.log('AuthGuard - Access DENIED, redirecting to login');
    this.router.navigate(['/login']);
    return false;
  }
}