import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  salt: string;

  @IsString()
  password: string;

  @IsDate()
  joinedDate: Date;

  // @IsOptional()
  // @IsArray()
  // assets?: Asset[]; // Assuming you want to reference Asset entities

  // @IsOptional()
  // @IsArray()
  // advertized?: UserAdvertized[]; // Assuming you want to reference Asset entities
}
