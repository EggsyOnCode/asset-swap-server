import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateUserAssetDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  assetId: number;

  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  createdAt: Date;

  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  boughtAt: Date;
}
