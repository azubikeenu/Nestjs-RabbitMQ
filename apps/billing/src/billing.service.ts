import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BillingService {
  private Logger = new Logger(BillingService.name);

  bill(data: any) {
    this.Logger.log('Logging......', data);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
