import { PartialType } from '@nestjs/mapped-types';
import { CreateAdvertizedAssetDto } from './create-advertized-asset.dto';

export class UpdateAdvertizedAssetDto extends PartialType(CreateAdvertizedAssetDto) {}
