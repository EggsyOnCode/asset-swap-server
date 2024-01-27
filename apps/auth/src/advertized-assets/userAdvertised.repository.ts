import { Catch, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { UserAdvertized } from './entities/userAdvertised.schema';
import { BaseAbstractRepository } from '@app/shared';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
@Catch(QueryFailedError, EntityNotFoundError)
export class UserAdvertizedRepository extends BaseAbstractRepository<UserAdvertized> {
  constructor(
    @InjectRepository(UserAdvertized)
    private readonly userAdvertRepo: Repository<UserAdvertized>,
  ) {
    super(userAdvertRepo);
  }

  async findAllAdvertsOfSeller(userId: number) {
    try {
      const result: any = await this.userAdvertRepo.find({
        where: { userId },
        relations: ['user', 'asset'],
      });

      if (!result || result.length == 0) {
        // If no record is found, you can throw a custom exception or return null.
        throw new EntityNotFoundError(UserAdvertized, userId);
      }

      const transformedObject = result.reduce((result, item) => {
        // Extract user details from the first item in the array
        if (!result.user) {
          const { id, username, password, joinedDate } = item.user;
          result.user = { id, username, password, joinedDate };
        }

        // Create an 'assets' property in the result if it doesn't exist
        if (!result.assets) {
          result.assets = [];
        }

        // Extract asset details
        const {
          id,
          assetClass,
          mileage,
          location,
          registeredProvince,
          enginePower,
          carType,
          manufacturingDate,
          fuelType,
          price,
        } = item.asset;

        // Push asset details along with 'createdAt' and 'removedAt' into 'assets' array
        result.assets.push({
          asset: {
            id,
            assetClass,
            mileage,
            location,
            registeredProvince,
            enginePower,
            carType,
            manufacturingDate,
            fuelType,
            price,
            createdAt: item.createdAt,
            removedAt: item.removedAt,
          },
        });

        return result;
      }, {});

      return transformedObject;
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

  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<UserAdvertized>> {
    const results = this.userAdvertRepo
      .createQueryBuilder()
      .select('userAdvert')
      .from(UserAdvertized, 'userAdvert')
      .leftJoinAndSelect('userAdvert.user', 'user')
      .leftJoinAndSelect('userAdvert.asset', 'asset')
      .orderBy('userAdvert.userId', 'DESC');

    return paginate<UserAdvertized>(results, options);
  }
}
