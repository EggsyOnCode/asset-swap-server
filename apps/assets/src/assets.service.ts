// assets.service.ts
import { Injectable } from '@nestjs/common';
import { CreateAssetDto } from './DTOs/createAssetDTO.request';
import { AssetRepository } from './asset.repository';
import { updateAssetDto } from './updateAssetd.dto';

@Injectable()
export class AssetsService {
  constructor(private readonly assetRepo: AssetRepository) {}

  findAll() {
    return this.assetRepo.findAll();
  }

  findOne(id: number) {
    return this.assetRepo.findOneById(id);
  }

  async create(assetDTO: CreateAssetDto) {
    const item = await this.assetRepo.save(assetDTO);
    return item;
  }

  async update(id: number, updatedAsset: updateAssetDto) {
    const item = await this.assetRepo.findOne({
      where: { id },
    });
    return this.assetRepo.save({
      ...item, // existing fields
      ...updatedAsset, // updated fields
    });
  }

  async delete(id: number) {
    const item = await this.assetRepo.findOne({
      where: { id },
    });
    return this.assetRepo.remove(item);
  }
}
