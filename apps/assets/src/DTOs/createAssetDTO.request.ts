import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AssetClass, Province, Type, FuelType } from '../entities/asset.schema';

export class CreateAssetDto {
  @IsEnum(AssetClass)
  assetClass: AssetClass;

  @IsNotEmpty()
  @IsNumber()
  mileage: number;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsEnum(Province)
  registeredProvince: Province;

  @IsNotEmpty()
  @IsString()
  enginePower: string;

  @IsEnum(Type)
  carType: Type;

  @IsNotEmpty()
  manufacturingDate: string;

  @IsEnum(FuelType)
  fuelType: FuelType;

  @IsString()
  price: string;
}
