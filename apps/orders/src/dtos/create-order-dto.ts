import { IsEnum, IsNumber } from 'class-validator';
import { State } from '../entities/order.schema';

export class CreateOrderDto {
  @IsNumber()
  id: number;

  @IsNumber()
  sellerId: number;

  @IsNumber()
  buyerId: number;

  @IsNumber()
  assetId: number;

  @IsEnum(State)
  state: State;
}
