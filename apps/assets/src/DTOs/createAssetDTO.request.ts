import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AssetClass, Province, Type, FuelType } from '../entities/asset.schema';

export class CreateAssetDto {
  @IsEnum(AssetClass)
  @IsOptional()
  assetClass: AssetClass;

  @IsNotEmpty()
  mileage: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsEnum(Province)
  registeredProvince: Province;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  enginePower: string;

  @IsEnum(Type)
  @IsOptional()
  carType: Type;

  @IsNotEmpty()
  manufacturingDate: string;

  @IsEnum(FuelType)
  @IsOptional()
  fuelType: FuelType;

  @IsString()
  price: string;

  @IsString()
  @IsOptional()
  imageUrl: string;
}
