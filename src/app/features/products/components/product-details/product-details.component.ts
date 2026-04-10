import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CartService } from 'src/app/core/services/cart.service';
import { Product, ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  quantity = 1;
  error = '';
  success = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load product';
        this.loading = false;
      }
    });
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.error = 'Please log in to add items to cart';
      return;
    }
    this.loading = true;
    this.cartService.addToCart({
      productId: this.product.id,
      userId: user.userId,
      quantity: this.quantity
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/cart']);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to add to cart';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
