import { Asset } from 'apps/assets/src/entities/asset.schema';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { UserAdvertized } from '../../advertized-assets/entities/userAdvertised.schema';

export class CreateUserDto {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsDate()
  joinedDate: Date;

  @IsOptional()
  @IsArray()
  assets?: Asset[]; // Assuming you want to reference Asset entities

  @IsOptional()
  @IsArray()
  advertized?: UserAdvertized[]; // Assuming you want to reference Asset entities
}
