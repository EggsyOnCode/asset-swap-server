import { BaseAbstractRepository } from '@app/database/abstract.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { UserAssets } from './entities/userAssets.schema';

@Injectable()
export class UserAssetRepo extends BaseAbstractRepository<UserAssets> {
  constructor(
    @InjectRepository(UserAssets)
    private readonly userRepository: Repository<UserAssets>,
  ) {
    super(userRepository);
  }

  async assetUser(userId: number) {
    try {
      const result = await this.userRepository.find({
        where: { userId },
        select: ['createdAt', 'boughtAt', 'user', 'asset'],
        relations: ['asset', 'user'], // Corrected relation name to 'user'
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
}
