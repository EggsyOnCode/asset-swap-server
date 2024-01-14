import { Injectable } from '@nestjs/common';
import { CreateAdvertizedAssetDto } from './dto/create-advertized-asset.dto';
import { UpdateAdvertizedAssetDto } from './dto/update-advertized-asset.dto';
import { UserAdvertizedRepository } from './userAdvertised.repository';

@Injectable()
export class UserAdvertizedAssetsService {
  constructor(private readonly userAdvertRepo: UserAdvertizedRepository) {}

  findAll() {
    return this.userAdvertRepo.findAll();
  }

  findAllUserAdverts(sellerId: number) {
    return this.userAdvertRepo.findAllAdvertsOfSeller(sellerId);
  }

  findOne(userId: number, assetId: number) {
    return this.userAdvertRepo.findOne({ where: { userId, assetId } });
  }

  async create(assetDTO: CreateAdvertizedAssetDto) {
    const item = await this.userAdvertRepo.save(assetDTO);
    return item;
  }

  async update(
    userId: number,
    assetId: number,
    updatedAsset: UpdateAdvertizedAssetDto,
  ) {
    const item = await this.userAdvertRepo.findOne({
      where: { userId, assetId },
    });
    return this.userAdvertRepo.save({
      ...item, // existing fields
      ...updatedAsset, // updated fields
    });
  }

  async delete(userId: number, assetId: number) {
    const item = await this.userAdvertRepo.findOne({
      where: { userId, assetId },
    });
    return this.userAdvertRepo.remove(item);
  }
}
