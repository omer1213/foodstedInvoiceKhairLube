import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ItemsComponent } from './items/items.component';
import { SaleReportComponent } from './sale-report/sale-report';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'sale_report', component: SaleReportComponent },
  { path: 'items', component: ItemsComponent, canActivate: [AuthGuard] },
  { path: 'invoiceprint/:invoiceid', component: DashboardComponent },
  { path: '**', redirectTo: '/login' }
];
