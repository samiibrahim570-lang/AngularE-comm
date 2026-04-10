import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService, Order } from '../../../../core/services/order.service';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent implements OnInit {
  order: Order | null = null;
  loading = false;
  error = '';

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrderDetails(parseInt(orderId));
    }
  }

  loadOrderDetails(orderId: number): void {
    this.loading = true;
    this.orderService.getOrderDetails(orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load order details';
        this.loading = false;
      }
    });
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  backToCart(): void {
    this.router.navigate(['/cart']);
  }
}
