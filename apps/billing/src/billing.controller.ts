import { Controller, Get, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { EventPattern, Ctx, RmqContext, Payload } from '@nestjs/microservices';
import { AmqpService, JwtAuthGuard } from '@app/common';

@Controller()
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly amqpService: AmqpService,
  ) {}

  @Get()
  getHello(): string {
    return this.billingService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @EventPattern('order_created')
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.billingService.bill(data);
    this.amqpService.ack(context);
  }
}
