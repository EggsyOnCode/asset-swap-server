import { BaseAbstractRepository } from '@app/database/abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAdvertized } from './entities/userAdvertised.schema';

@Injectable()
export class UserAdvertizedRepository extends BaseAbstractRepository<UserAdvertized> {
  constructor(
    @InjectRepository(UserAdvertized)
    private readonly userAdvertRepo: Repository<UserAdvertized>,
  ) {
    super(userAdvertRepo);
  }
}
