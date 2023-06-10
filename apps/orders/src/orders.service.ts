import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './dto/create_order_request.dto';
import { OrderRepository } from './order.repository';
import { BILLING_SERVICE } from './constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepostory: OrderRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  async createOrder(request: CreateOrderRequest, authentication: string) {
    const session = await this.orderRepostory.startTransaction();

    try {
      const order = this.orderRepostory.create(request, { session });
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request,
          Authentication: authentication,
        }),
      );
      await session.commitTransaction();
      return order;
    } catch (err: any) {
      session.abortTransaction();
      throw err;
    }
  }

  async getOrders() {
    const orders = await this.orderRepostory.find({});
    return orders;
  }
}
