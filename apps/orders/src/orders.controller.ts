import { Controller, Body, Post, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderRequest } from './dto/create_order_request.dto';
import { Order } from './schemas/orders.schema';
import { JwtAuthGuard } from '@app/common/auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(
    @Body() request: CreateOrderRequest,
    @Req() req: any,
  ): Promise<Order> {
    console.log(req.user);
    return this.ordersService.createOrder(request, req.cookies?.Authentication);
  }

  async getOrders(): Promise<Order[]> {
    return this.ordersService.getOrders();
  }
}
