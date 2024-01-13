import { Injectable } from '@nestjs/common';
import { UserAssetRepo } from './userAsset.repository';
import { CreateUserAssetDto } from './dto/create-user-asset.dto';
import { UpdateUserAssetDto } from './dto/update-user-asset.dto';

@Injectable()
export class UserAssetsService {
  constructor(private readonly userAssetRepo: UserAssetRepo) {}

  findAll() {
    return this.userAssetRepo.findAll();
  }

  findOne(userId: number, assetId: number) {
    return this.userAssetRepo.findOne({ where: { userId, assetId } });
  }

  async create(assetDTO: CreateUserAssetDto) {
    const item = await this.userAssetRepo.save(assetDTO);
    return item;
  }

  async update(
    userId: number,
    assetId: number,
    updatedAsset: UpdateUserAssetDto,
  ) {
    const item = await this.userAssetRepo.findOne({
      where: { userId, assetId },
    });
    return this.userAssetRepo.save({
      ...item, // existing fields
      ...updatedAsset, // updated fields
    });
  }

  async delete(userId: number, assetId: number) {
    const item = await this.userAssetRepo.findOne({
      where: { userId, assetId },
    });
    return this.userAssetRepo.remove(item);
  }
}
