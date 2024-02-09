import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  id: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  orderId: number;

  @IsBoolean()
  @IsOptional()
  read: boolean;
}
