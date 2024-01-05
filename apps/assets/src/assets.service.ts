// assets.service.ts
import { Injectable } from '@nestjs/common';
import { CreateAssetDto } from './DTOs/createAssetDTO.request';
import { AssetRepository } from './asset.repository';

@Injectable()
export class AssetsService {
  constructor(private readonly assetRepo: AssetRepository) {}

  findAll() {
    // return this.assets;
    return 'hello';
  }

  findOne(id: number) {
    // return this.assets.find((asset) => asset.id === id);

    return id;
  }

  async create(assetDTO: CreateAssetDto) {
    await this.assetRepo.save(assetDTO);
  }

  update(id: number, updatedAsset: CreateAssetDto) {
    // const index = this.assets.findIndex((asset) => asset.id === id);
    // if (index === -1) return null; // or throw an exception if not found

    // const updated = { ...this.assets[index], ...updatedAsset };
    // this.assets[index] = updated;
    return `${id} ${updatedAsset}`;
  }

  delete(id: number) {
    // const index = this.assets.findIndex((asset) => asset.id === id);
    // if (index === -1) return null; // or throw an exception if not found

    // const deleted = this.assets.splice(index, 1)[0];
    return id;
  }
}
