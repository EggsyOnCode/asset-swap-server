// assets.service.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateAssetDto } from './DTOs/createAssetDTO.request';
import { AssetRepository } from './asset.repository';
import { updateAssetDto } from './updateAssetd.dto';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { ClientProxy } from '@nestjs/microservices';
import { ASSET_SERVICE } from './constants/services';
import { lastValueFrom } from 'rxjs';
import { DeepPartial } from 'typeorm';
import { Asset } from './entities/asset.schema';
@Injectable()
export class AssetsService {
  constructor(
    private readonly assetRepo: AssetRepository,
    private readonly configService: ConfigService,
    @Inject(ASSET_SERVICE) private client: ClientProxy,
  ) {}

  AWS_S3_BUCKET = this.configService.get('bucket_name');
  s3 = new AWS.S3({
    accessKeyId: this.configService.get('IAM_ACCESS_key'),
    secretAccessKey: this.configService.get('IAM_ACCESS_key_secret'),
  });

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
    const res = await this.uploadFile(file);
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

  async uploadFile(file) {
    console.log(file);
    const { originalname } = file;

    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'us-east-1',
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }
}
