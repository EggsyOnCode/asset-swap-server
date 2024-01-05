import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateUserAssetDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  assetId: number;

  @IsNotEmpty()
  @IsDateString()
  createdAt: Date;

  @IsNotEmpty()
  @IsDateString()
  boughtAt: Date;
}
