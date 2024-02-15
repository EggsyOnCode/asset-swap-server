import { BaseAbstractRepository } from '@app/database/abstract.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { UserAssets } from './entities/userAssets.schema';

@Injectable()
export class UserAssetRepo extends BaseAbstractRepository<UserAssets> {
  constructor(
    @InjectRepository(UserAssets)
    private readonly userAssetRepository: Repository<UserAssets>,
  ) {
    super(userAssetRepository);
  }

  async assetUser(userId: number) {
    try {
      const result: any = await this.userAssetRepository.find({
        where: { userId },
        select: ['createdAt', 'boughtAt', 'user', 'asset'],
        relations: ['asset', 'user', 'seller'], // Corrected relation name to 'user'
      });

      if (!result || result.length == 0) {
        throw new HttpException(
          `User with id ${userId} not found or has no assets`,
          HttpStatus.NOT_FOUND,
        );
      }

      const transformedObject = result.reduce((result, item) => {
        // Extract asset details
        const { createdAt, boughtAt, asset } = item;

        // Extract user details
        const { user } = item;

        // Create an 'assets' property in the result if it doesn't exist
        if (!result.assets) {
          result.assets = [];
        }

        // Push asset details along with 'createdAt' and 'boughtAt' into 'assets' array
        result.assets.push({
          asset: { ...asset, createdAt, boughtAt },
        });

        // Assign user details to 'user' property
        result.user = user;

        return result;
      }, {});
      return transformedObject;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        // Handle not found scenario
        return null;
      }
      // Handle other errors
      throw error;
    }
  }

  async findUserAssets() {
    const queryBuilder =
      this.userAssetRepository.createQueryBuilder('user_assets');

    queryBuilder
      .leftJoinAndSelect('user_assets.user', 'user')
      .leftJoinAndSelect('user_assets.asset', 'asset')
      .leftJoin('user_assets.seller', 'seller');

    queryBuilder.select([
      'user_assets',
      'user.id', // Include specific columns from 'user'
      'user.username',
      'asset',
      'seller.id', // Include specific columns from 'seller'
      'seller.username',
      // Add more columns from 'seller' as needed
    ]);
    // .where('user_assets.userId = :userId', { userId });

    return queryBuilder.getMany();
  }

  async findUserAssetsByUser(userId: number) {
    const queryBuilder =
      this.userAssetRepository.createQueryBuilder('user_assets');

    queryBuilder
      .leftJoinAndSelect('user_assets.user', 'user')
      .leftJoinAndSelect('user_assets.asset', 'asset')
      .leftJoin('user_assets.seller', 'seller');

    queryBuilder
      .select([
        'user_assets',
        'user.id', // Include specific columns from 'user'
        'user.username',
        'asset',
        'seller.id', // Include specific columns from 'seller'
        'seller.username',
        // Add more columns from 'seller' as needed
      ])
      .where('user_assets.userId = :userId', { userId });

    return queryBuilder.getMany();
  }
}
