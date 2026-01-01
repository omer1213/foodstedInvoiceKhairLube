import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = 'printKhairLubricant';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is authenticated on app initialization
    const isAuthenticated = this.authService.getIsAuthenticated()();
    const currentRoute = this.router.url;
    
    if (isAuthenticated && (currentRoute === '/login' || currentRoute === '/')) {
      // If authenticated and on login page, redirect to dashboard
      this.router.navigate(['/dashboard']);
    } else if (!isAuthenticated && currentRoute !== '/login') {
      // If not authenticated and not on login page, redirect to login
      this.router.navigate(['/login']);
    }
  }
}
