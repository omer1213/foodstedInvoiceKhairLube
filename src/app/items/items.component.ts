import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ItemsService, Item, ItemsResponse } from '../services/items.service';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent implements OnInit {
  protected readonly items = signal<Item[]>([]);
  protected readonly filteredItems = signal<Item[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly error = signal('');
  protected readonly sortBy = signal<'name' | 'code' | 'rate' | 'unit'>('name');
  protected readonly sortOrder = signal<'asc' | 'desc'>('asc');

  constructor(
    private itemsService: ItemsService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadItems();
  }

  get user() {
    return this.authService.getCurrentUser();
  }

  async loadItems() {
    this.isLoading.set(true);
    this.error.set('');

    try {
      const response: ItemsResponse = await this.itemsService.getItems();
      this.items.set(response.items_list);
      this.filteredItems.set(response.items_list);
      this.applySort();
    } catch (error: any) {
      this.error.set(error.message);
    } finally {
      this.isLoading.set(false);
    }
  }

  private applySort() {
    const sortBy = this.sortBy();
    const sortOrder = this.sortOrder();
    
    const sorted = [...this.items()].sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';
      
      switch (sortBy) {
        case 'name':
          aValue = (a.item_name || '').toLowerCase();
          bValue = (b.item_name || '').toLowerCase();
          break;
        case 'code':
          aValue = (a.item_code || '').toLowerCase();
          bValue = (b.item_code || '').toLowerCase();
          break;
        case 'rate':
          aValue = parseFloat(a.item_rate) || 0;
          bValue = parseFloat(b.item_rate) || 0;
          break;
        case 'unit':
          aValue = (a.item_unit || '').toLowerCase();
          bValue = (b.item_unit || '').toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    this.filteredItems.set(sorted);
  }

  onSortChange(sortBy: 'name' | 'code' | 'rate' | 'unit') {
    if (this.sortBy() === sortBy) {
      // Toggle sort order
      this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(sortBy);
      this.sortOrder.set('asc');
    }
    // Use setTimeout to ensure signals are updated before sorting
    setTimeout(() => this.applySort(), 0);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout();
  }

  formatPrice(price: string): string {
    return parseFloat(price).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}