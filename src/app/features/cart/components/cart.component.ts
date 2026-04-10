import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { AuthResponse, AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  loading = false;
  error = '';
  total = 0;
  isCheckingOut = false;
  showGuestForm = false;
  guestForm: FormGroup;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router,
    private formBuilder: FormBuilder,
    private nzmessage: NzMessageService
  ) {
    this.guestForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      whatsAppNumber: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadCart();
  }

  loadCart(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.loading = true;
    this.cartService.getCart(user.userId).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load cart';
        this.loading = false;
      }
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => {
      const price = item.price || 0;
      return sum + (price * item.quantity);
    }, 0);
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeItem(item.id);
      return;
    }
    this.cartService.updateCartItem(item.id, newQuantity).subscribe({
      next: () => {
        item.quantity = newQuantity;
        this.calculateTotal();
      },
      error: (err) => {
        this.error = 'Failed to update cart';
      }
    });
  }

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        this.calculateTotal();
      },
      error: (err) => {
        this.error = 'Failed to remove item';
      }
    });
  }

  clearCart(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart(user.userId).subscribe({
        next: () => {
          this.cartItems = [];
          this.total = 0;
        },
        error: (err) => {
          this.error = 'Failed to clear cart';
        }
      });
    }
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  checkout(): void {
    const user = this.authService.getCurrentUser();

    if (this.cartItems.length === 0) {
      this.error = 'Your cart is empty';
      return;
    }
    if (!user) {
      this.showGuestForm = true;
      return;
    }
    this.proceedWithCheckout();
  }

  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  currentUser: AuthResponse | null = null;


  proceedWithCheckout(): void {
    if (this.cartItems.length === 0) {
      this.error = 'Your cart is empty';
      return;
    }
    const userId = this.currentUser?.userId;

    if (!userId) {
      this.error = 'User not logged in';
      return;
    }
    this.isCheckingOut = true;

    this.orderService.placeOrder(userId).subscribe({
      next: (order: any) => {
        this.isCheckingOut = false;
        this.cartItems = [];
        this.total = 0;
        console.log("ORDER RESPONSE:", order);
        const orderId = order?.id || order?.Id;
        if (orderId) {
          this.router.navigate(['/order/profile', orderId]);
        } else {
          this.error = 'Order placed but ID not received';
        }
      },
      error: (err) => {
        this.isCheckingOut = false;
        this.nzmessage.success('Order placed successfully!');
        console.error(err);
      }
    });
  }

  closeGuestForm(): void {
    this.showGuestForm = false;
  }

  onGuestCheckoutSubmit(guestData: any): void {
    if (!this.guestForm.valid) {
      this.error = 'Please fill in all required fields correctly';
      return;
    }
    this.loading = true;
    this.authService.registerGuestUser(guestData).subscribe({
      next: (response) => {
        this.loading = false;
        this.showGuestForm = false;
        if (response.userId && response.userId > 0) {
          this.proceedWithCheckout();
        } else {
          this.error = 'Failed to retrieve user ID. Please try again.';
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to create account. Please try again.';
      }
    });
  }


  getShippingCost(): number {
    return this.total > 50 ? 0 : 10; // Free shipping over $50
  }

  getFinalTotal(): number {
    return this.total + this.getShippingCost();
  }
}
