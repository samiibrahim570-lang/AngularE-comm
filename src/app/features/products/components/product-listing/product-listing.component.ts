import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.css']
})
export class ProductListingComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  error = '';
  selectedCategory = 'all';
  searchQuery = '';
  sortBy = 'name';

  categories = ['all', 'Electronics', 'Accessories', 'Clothing', 'Home'];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.filterAndSort();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  filterAndSort(): void {
    let filtered = [...this.products];

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.categoryName === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // Sort
    if (this.sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.filteredProducts = filtered;
  }

  onCategoryChange(): void {
    this.filterAndSort();
  }

  onSearchChange(): void {
    this.filterAndSort();
  }

  onSortChange(): void {
    this.filterAndSort();
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }
}
