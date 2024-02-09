import { BaseAbstractRepository } from '@app/database/abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.schema';

@Injectable()
export class NotificationRepository extends BaseAbstractRepository<Notification> {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {
    super(notificationRepo);
  }
}
