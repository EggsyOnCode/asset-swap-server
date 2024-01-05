import { PartialType } from '@nestjs/mapped-types';
import { CreateAssetDto } from './DTOs/createAssetDTO.request';

export class updateAssetDto extends PartialType(CreateAssetDto) {}
