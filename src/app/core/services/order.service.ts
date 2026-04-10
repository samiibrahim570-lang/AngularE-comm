import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Order {
  id: number;
  userId: number;
  orderDate: string;
  status: string;
  total: number;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) { }

  // Place a new order
  placeOrder(userId: number): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/${userId}`, {});
  }

  // Get all orders for a user
  getOrders(userId: number, role: string = 'Customer'): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}?userId=${userId}&role=${role}`);
  }

  // Get order details
  getOrderDetails(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/details/${orderId}`);
  }

  // Update order status (Admin only)
  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/status/${orderId}`, status);
  }

  // Delete order (Admin only)
  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${orderId}`);
  }
}
