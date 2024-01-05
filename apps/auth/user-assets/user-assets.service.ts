import { Injectable } from '@nestjs/common';
import { CreateUserAssetDto } from './dto/create-user-asset.dto';
import { UpdateUserAssetDto } from './dto/update-user-asset.dto';

@Injectable()
export class UserAssetsService {
  create(createUserAssetDto: CreateUserAssetDto) {
    return 'This action adds a new userAsset';
  }

  findAll() {
    return `This action returns all userAssets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userAsset`;
  }

  update(id: number, updateUserAssetDto: UpdateUserAssetDto) {
    return `This action updates a #${id} userAsset`;
  }

  remove(id: number) {
    return `This action removes a #${id} userAsset`;
  }
}
