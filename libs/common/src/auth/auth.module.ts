import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AmqpModule } from '../amqp/amqp.module';
import { AUTH_SERVICE } from './auth.services';

// the main purpose of this auth_module is to share authentication between services using guards
// it extracts the request object from each service requests and emits and event with
// the request object as the payload and sends it to the authentication service for
// consumption , which sends a response back with the authentication value of the user
@Module({
  imports: [AmqpModule.register({ name: AUTH_SERVICE })],
  exports: [AmqpModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
