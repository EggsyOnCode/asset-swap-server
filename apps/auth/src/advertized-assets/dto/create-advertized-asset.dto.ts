import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class CreateAdvertizedAssetDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  assetId: number;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsDate()
  @IsOptional()
  removedAt: Date;
}
