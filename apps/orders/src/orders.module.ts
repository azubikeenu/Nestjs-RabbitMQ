import { Module, ValidationPipe } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ConfigModule } from '@nestjs/config';
import { OrdersService } from './orders.service';
import * as Joi from 'joi';
import { AmqpModule, AuthModule, DatabaseModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, orderSchema } from './schemas/orders.schema';
import { APP_PIPE } from '@nestjs/core';
import { OrderRepository } from './order.repository';
import { BILLING_SERVICE } from './constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/orders/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: orderSchema,
      },
    ]),
    //creates a client proxy to emit messages to the billingServiceQueue [ie a client proxy for the billing service]
    AmqpModule.register({ name: BILLING_SERVICE }),
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      // global validation
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
    OrderRepository,
  ],
})
export class OrdersModule {}
