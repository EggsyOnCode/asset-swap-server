import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  // @IsNumber()
  // @IsOptional()
  // id: number;

  @IsNumber()
  fromId: number;

  @IsNumber()
  toId: number;

  @IsBoolean()
  @IsOptional()
  read: boolean;

  @IsNumber()
  orderId: number;

  @IsString()
  msg: string;
}
