import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { AmqpService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get<ConfigService>(ConfigService);
  const amqpService = app.get<AmqpService>(AmqpService);
  const PORT = configService.get<number>('PORT');
  // create a listener
  app.connectMicroservice(amqpService.getOptions('AUTH', true));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.startAllMicroservices();
  await app.listen(PORT);
}
bootstrap();
