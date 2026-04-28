import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.html'
})
export class InventoryComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading: boolean = true;
  currentFilter: 'ALL' | 'PRODUCT' | 'SERVICE' | 'LOW_STOCK' = 'ALL';

  stats = {
    totalSkus: 0,
    lowStockCount: 0,
    inventoryValue: 0,
    pendingRepairs: 56 // Mock constante
  };

  constructor(private productService: ProductService,
                      private router: Router,
                      private cdr: ChangeDetectorRef
                    ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
  this.loading = true;
  this.productService.getAll().subscribe({
    next: (data) => {
      this.products = data;
      this.applyFilter('ALL');
      this.calculateStats();
      this.loading = false;
      
      // 3. Obliga a Angular a revisar la vista justo ahora
      this.cdr.detectChanges(); 
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}

  goToManage(): void {
    this.router.navigate(['/inventory/manage-inventory']);
  }

  calculateStats(): void {
    this.stats.totalSkus = this.products.length;
    this.stats.lowStockCount = this.products.filter(p => 
      p.Item_Type === 'PRODUCT' && p.Current_Stock <= p.Minimum_Stock && p.Current_Stock > 0
    ).length;
    
    this.stats.inventoryValue = this.products.reduce((acc, p) => 
      acc + (p.Cost_Price * p.Current_Stock), 0
    );
  }

  applyFilter(filter: 'ALL' | 'PRODUCT' | 'SERVICE' | 'LOW_STOCK'): void {
    this.currentFilter = filter;
    if (filter === 'ALL') {
      this.filteredProducts = this.products;
    } else if (filter === 'LOW_STOCK') {
      this.filteredProducts = this.products.filter(p => 
        p.Item_Type === 'PRODUCT' && p.Current_Stock <= p.Minimum_Stock
      );
    } else {
      this.filteredProducts = this.products.filter(p => p.Item_Type === filter);
    }
  }

  getStatusInfo(p: Product) {
    if (p.Item_Type === 'SERVICE') return { label: 'Servicio', dot: 'bg-indigo-500', text: 'text-indigo-700 bg-indigo-50' };
    if (p.Current_Stock <= 0) return { label: 'Sin Stock', dot: 'bg-rose-500', text: 'text-rose-700 bg-rose-50' };
    if (p.Current_Stock <= p.Minimum_Stock) return { label: 'Stock Bajo', dot: 'bg-amber-500', text: 'text-amber-700 bg-amber-50' };
    return { label: 'Disponible', dot: 'bg-emerald-500', text: 'text-emerald-700 bg-emerald-50' };
  }
}