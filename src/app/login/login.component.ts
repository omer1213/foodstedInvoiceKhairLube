import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly isLoading = signal(false);
  protected readonly error = signal('');
  protected readonly showPassword = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onEmailChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.email.set(target.value);
    if (this.error()) {
      this.error.set('');
    }
  }

  onPasswordChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.password.set(target.value);
    if (this.error()) {
      this.error.set('');
    }
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  async onSubmit() {
    if (!this.email().trim() || !this.password().trim()) {
      this.error.set('Please enter both email and password');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    try {
      await this.authService.login(this.email(), this.password());
      console.log('Login success - Token stored:', !!localStorage.getItem('khair_token'));
      console.log('Login success - User stored:', !!localStorage.getItem('khair_user'));
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.error.set(error.message || 'Login failed. Please check your credentials.');
    } finally {
      this.isLoading.set(false);
    }
  }
}