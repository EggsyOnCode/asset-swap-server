import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  salt: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsDate()
  @ApiProperty()
  joinedDate: Date;

  // @IsOptional()
  // @IsArray()
  // assets?: Asset[]; // Assuming you want to reference Asset entities

  // @IsOptional()
  // @IsArray()
  // advertized?: UserAdvertized[]; // Assuming you want to reference Asset entities
}
