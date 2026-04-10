import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CartItem {
  id: number;
  quantity: number;
  productName: string;
  price: number;
  imageUrl: string;
  userName?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  whatsAppNumber?: string | null;
  productId?: number;
  userId?: number;
}

export interface CartItemDto {
  productId: number;
  userId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiBaseUrl}/cart`;
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) { }

  getCart(userId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/${userId}`);
  }

  addToCart(item: CartItemDto): Observable<CartItem> {
    return this.http.post<CartItem>(this.apiUrl, item);
  }

  updateCartItem(id: number, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/${id}`, quantity);
  }

  removeFromCart(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  clearCart(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear/${userId}`);
  }

  updateCartItems(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => {
      const price = item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  }
}
