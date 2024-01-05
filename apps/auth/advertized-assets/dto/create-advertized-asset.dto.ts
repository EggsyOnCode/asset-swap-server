import { IsDate, IsNumber } from 'class-validator';

export class CreateAdvertizedAssetDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  assetId: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  removedAt: Date;
}
