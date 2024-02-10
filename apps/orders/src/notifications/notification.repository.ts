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
  async findNotifByUser(userId: number) {
    // Get a new query builder for the Notification entity
    const queryBuilder =
      this.notificationRepo.createQueryBuilder('notification');

    // Join Notification and Order tables on orderId
    queryBuilder.leftJoinAndSelect(
      'notification.order',
      'order',
      'notification.orderId = order.id',
    );
    queryBuilder.leftJoinAndSelect('notification.from', 'user');
    queryBuilder.leftJoinAndSelect('order.asset', 'asset');

    queryBuilder
      .where('notification.toId = :userId', { userId })
      .andWhere('notification.read = :read', { read: false });

    // Execute the query and return the result
    return queryBuilder.getMany();
  }
}
