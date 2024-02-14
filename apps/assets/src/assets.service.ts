// assets.service.ts
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateAssetDto } from './DTOs/createAssetDTO.request';
import { AssetRepository } from './asset.repository';
import { updateAssetDto } from './updateAssetd.dto';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { DeepPartial } from 'typeorm';
import { Asset } from './entities/asset.schema';
import { AUTH_SERVICE } from './constants/services';
import { extractS3ObjectKey } from './utils/functions';
import { AwsUtilsService, NftStorageService } from '@app/shared';
import { NftInfoDTO } from './DTOs/NftInfo';
@Injectable()
export class AssetsService {
  constructor(
    private readonly assetRepo: AssetRepository,
    private readonly configService: ConfigService,
    @Inject(AUTH_SERVICE) private client: ClientProxy,
    private readonly awsService: AwsUtilsService,
    private readonly nftStorage: NftStorageService,
  ) {}

  findAll() {
    return this.assetRepo.findAll();
  }

  findOne(id: number) {
    return this.assetRepo.findOne({ where: { id } });
  }

  async create(
    file: Express.Multer.File,
    assetDTO: CreateAssetDto,
    userId: number,
  ) {
    const res = await this.awsService.uploadFile(file);
    console.log(res);
    const mileage = parseInt(assetDTO.mileage, 10);
    const assetFinal: DeepPartial<Asset> = {
      ...assetDTO,
      mileage,
      imgUrl: res.Location,
    };
    const item = await this.assetRepo.save(assetFinal);
    console.log('asset created!');
    this.client.emit('asset_created', {
      asset: item,
      creator: userId,
    }),
      console.log('asset created event dispatched ');

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

  async getObject(assetId: number) {
    const asset = await this.assetRepo.findOne({
      where: {
        id: assetId,
      },
    });

    if (!asset) {
      throw new HttpException(
        `Asset with ID ${assetId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const object_key = extractS3ObjectKey(asset.imgUrl);
    const file = await this.awsService.fetchS3Object(object_key);
    return file;
  }

  async uploadNftToIpfs(nftInfo: NftInfoDTO) {
    const file_key = extractS3ObjectKey(nftInfo.imgUrl);

    const nftUrl = await this.nftStorage.storeNft(nftInfo, file_key);

    console.log(nftUrl);

    return nftUrl;
  }
}
