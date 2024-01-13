import { BaseAbstractRepository } from '@app/database/abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAssets } from './entities/userAssets.schema';

@Injectable()
export class UserAssetRepo extends BaseAbstractRepository<UserAssets> {
  constructor(
    @InjectRepository(UserAssets)
    private readonly userRepository: Repository<UserAssets>,
  ) {
    super(userRepository);
  }
}