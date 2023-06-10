import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    // using email and password for authentication
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    return this.usersService.validateUser(email, password);
  }
}
