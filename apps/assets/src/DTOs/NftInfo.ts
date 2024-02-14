import { IsString } from 'class-validator';

export class NftInfoDTO {
  @IsString()
  model: string;

  @IsString()
  price: string;

  @IsString()
  imgUrl: string;

  @IsString()
  location: string;

  @IsString()
  sellerAddress: string;

  @IsString()
  buyerAddress: string;
}
