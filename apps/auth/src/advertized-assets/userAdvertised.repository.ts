import { Catch, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { UserAdvertized } from './entities/userAdvertised.schema';
import { BaseAbstractRepository } from '@app/shared';

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
      const result = await this.userAdvertRepo.findOne({
        where: { userId },
        relations: ['user', 'asset'],
      });

      if (!result) {
        // If no record is found, you can throw a custom exception or return null.
        throw new EntityNotFoundError(UserAdvertized, userId);
      }

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
}
