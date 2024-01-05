import { Asset } from 'apps/assets/src/entities/asset.schema';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsDate()
  joinedDate: Date;

  // Assuming you want to reference Asset entities
  @IsOptional()
  @IsNumber({}, { each: true })
  assets: number;
}
