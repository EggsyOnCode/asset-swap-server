import { Injectable, Logger } from '@nestjs/common';
import { CreateAdvertizedAssetDto } from './dto/create-advertized-asset.dto';
import { UpdateAdvertizedAssetDto } from './dto/update-advertized-asset.dto';
import { UserAdvertizedRepository } from './userAdvertised.repository';
import { EntityNotFoundError } from 'typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { UserAdvertized } from './entities/userAdvertised.schema';
import { Asset } from 'apps/assets/src/entities/asset.schema';

@Injectable()
export class UserAdvertizedAssetsService {
  constructor(private readonly userAdvertRepo: UserAdvertizedRepository) {}

  findAll() {
    return this.userAdvertRepo.findAll();
  }

  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<UserAdvertized>> {
    return this.userAdvertRepo.paginate(options);
  }
  async findAllUserAdverts(sellerId: number) {
    try {
      const result = await this.userAdvertRepo.findAllAdvertsOfSeller(sellerId);

      // Handle the result or do further processing if needed
      return result;
    } catch (error) {
      // Handle the error here
      if (error instanceof EntityNotFoundError) {
        // Handle not found scenario
        return null;
      }
      // Handle other errors
      throw error;
    }
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

  async assignAssetToUser(data: any) {
    const asset: Asset = data.asset;
    const creatorId = data.creator;
    const assetID = asset.id;
    const userId = creatorId;

    const assetAdvert: CreateAdvertizedAssetDto = {
      assetId: assetID,
      userId: userId,
    };

    const item = await this.userAdvertRepo.save(assetAdvert);
    if (item) {
      Logger.log('asset assigned to user');
    } else {
      throw Error('asset couldn;t be assigned to user ');
    }
  }
}
