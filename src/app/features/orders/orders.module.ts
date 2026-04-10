import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { OrdersRoutingModule } from './orders-routing.module';

@NgModule({
  declarations: [
    OrderSuccessComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule
  ]
})
export class OrdersModule { }
