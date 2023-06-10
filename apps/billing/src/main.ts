import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module';
import { AmqpService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  const amqpService = app.get<AmqpService>(AmqpService);
  app.connectMicroservice(amqpService.getOptions('BILLING'));
  await app.startAllMicroservices();
}
bootstrap();
