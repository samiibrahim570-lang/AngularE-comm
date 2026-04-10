import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService, Product } from 'src/app/core/services/product.service';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredProducts: Product[] = [];
  carouselProducts: Product[] = [];
  currentCarouselIndex = 0;
  loading = false;
  error = '';
  private destroy$ = new Subject<void>();
  // Carousel settings
  carouselItemsPerView = 4;
  carouselAnimationDuration = 5000; // 5 seconds per slide

  constructor(
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.startCarouselAutoRotation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.featuredProducts = products;
        // Duplicate products for seamless carousel loop
        this.carouselProducts = [...products, ...products];
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  startCarouselAutoRotation(): void {
    interval(this.carouselAnimationDuration)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.nextCarouselSlide();
      });
  }

  nextCarouselSlide(): void {
    this.currentCarouselIndex++;
    // Reset to beginning when reaching the end
    if (this.currentCarouselIndex >= this.featuredProducts.length) {
      this.currentCarouselIndex = 0;
    }
  }

  previousCarouselSlide(): void {
    this.currentCarouselIndex--;
    if (this.currentCarouselIndex < 0) {
      this.currentCarouselIndex = this.featuredProducts.length - 1;
    }
  }

  goToCarouselSlide(index: number): void {
    this.currentCarouselIndex = index;
  }

  getCarouselItems(): Product[] {
    if (this.carouselProducts.length === 0) return [];
    return this.carouselProducts.slice(
      this.currentCarouselIndex,
      this.currentCarouselIndex + this.carouselItemsPerView
    );
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  shopAll(): void {
    this.router.navigate(['/products']);
  }
}
