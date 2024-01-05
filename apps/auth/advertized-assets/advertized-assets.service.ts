import { Injectable } from '@nestjs/common';
import { CreateAdvertizedAssetDto } from './dto/create-advertized-asset.dto';
import { UpdateAdvertizedAssetDto } from './dto/update-advertized-asset.dto';

@Injectable()
export class AdvertizedAssetsService {
  create(createAdvertizedAssetDto: CreateAdvertizedAssetDto) {
    return 'This action adds a new advertizedAsset';
  }

  findAll() {
    return `This action returns all advertizedAssets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} advertizedAsset`;
  }

  update(id: number, updateAdvertizedAssetDto: UpdateAdvertizedAssetDto) {
    return `This action updates a #${id} advertizedAsset`;
  }

  remove(id: number) {
    return `This action removes a #${id} advertizedAsset`;
  }
}
