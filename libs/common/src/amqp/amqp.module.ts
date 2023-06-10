import { DynamicModule, Module } from '@nestjs/common';
import { AmqpService } from './amqp.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
interface AmqpModuleOptions {
  name: string;
}

@Module({
  providers: [AmqpService],
  exports: [AmqpService],
})
export class AmqpModule {
  static register({ name }: AmqpModuleOptions): DynamicModule {
    return {
      module: AmqpModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('RABBIT_MQ_URI')],
                queue: configService.get<string>(`RABBIT_MQ_${name}_QUEUE`),
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
