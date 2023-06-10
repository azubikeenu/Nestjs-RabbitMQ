import {
  Injectable,
  CanActivate,
  Inject,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, tap, catchError } from 'rxjs';
import { AUTH_SERVICE } from './auth.services';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // gets the authentication from the cookie or message payload
    const authentication = this.getAuthentication(context);
    // emits a validate user event and waits for a response which is an observavle
    return this.authClient
      .send('validate_user', {
        Authentication: authentication,
      })
      .pipe(
        tap((res) => {
          this.addUser(res, context);
        }),
        catchError(() => {
          throw new UnauthorizedException();
        }),
      );
  }

  private getAuthentication(context: ExecutionContext) {
    let authentication: string;
    if (context.getType() === 'rpc') {
      // handle requests sent over ampq
      authentication = context.switchToRpc().getData().Authentication;
    } else if (context.getType() === 'http') {
      // handle requests sent over http and extract authentication object from the cookie
      authentication = context.switchToHttp().getRequest()
        .cookies?.Authentication;
    }
    if (!authentication) {
      throw new UnauthorizedException(
        'No value was provided for Authentication',
      );
    }
    return authentication;
  }

  private addUser(user: any, context: ExecutionContext) {
    if (context.getType() === 'rpc') {
      context.switchToRpc().getData().user = user;
    } else if (context.getType() === 'http') {
      // get the current user object if it is present because on validation the current user is send as a response from the auth validate
      // user handler
      context.switchToHttp().getRequest().user = user;
    }
  }
}
