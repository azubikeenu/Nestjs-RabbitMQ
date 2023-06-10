import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsPositive,
} from 'class-validator';
export class CreateOrderRequest {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsPhoneNumber()
  phoneNumber: string;
  @IsPositive()
  price: number;
}
