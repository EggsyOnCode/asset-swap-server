import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationsService {
  constructor(private readonly notifcationRepo: NotificationRepository) {}
  async create(createNotificationDto: CreateNotificationDto) {
    const item = await this.notifcationRepo.save(createNotificationDto);
    return item;
  }

  findAll() {
    return this.notifcationRepo.findAll();
  }

  findOne(id: number) {
    return this.notifcationRepo.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updatedNotification: UpdateNotificationDto) {
    const item = await this.notifcationRepo.findOne({
      where: { id },
    });
    return this.notifcationRepo.save({
      ...item, // existing fields
      ...updatedNotification, // updated fields
    });
  }

  async remove(id: number) {
    const item = await this.notifcationRepo.findOne({
      where: { id },
    });
    return this.notifcationRepo.remove(item);
  }

  async fetchNotificationsForUser(userId: number) {
    return this.notifcationRepo.findAll({
      where: {
        userId: userId,
      },
    });
  }

  async fetchNotificationsCountForUser(userId: number) {
    const items = this.notifcationRepo.findAll({
      where: {
        userId: userId,
      },
    });
    return {
      count: (await items).length,
      userId: userId,
    };
  }
}
