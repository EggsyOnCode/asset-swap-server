import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationRepository } from './notification.repository';
import { OnEvent } from '@nestjs/event-emitter';

export class NotificationReadEvent {
  constructor(public ids: number[]) {}
}

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationRepo: NotificationRepository) {}
  async create(createNotificationDto: CreateNotificationDto) {
    const item = await this.notificationRepo.save(createNotificationDto);
    return item;
  }

  findAll() {
    return this.notificationRepo.findAll();
  }

  findOne(id: number) {
    return this.notificationRepo.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updatedNotification: UpdateNotificationDto) {
    const item = await this.notificationRepo.findOne({
      where: { id },
    });
    return this.notificationRepo.save({
      ...item, // existing fields
      ...updatedNotification, // updated fields
    });
  }

  async remove(id: number) {
    const item = await this.notificationRepo.findOne({
      where: { id },
    });
    return this.notificationRepo.remove(item);
  }

  async fetchNotificationsForUser(userId: number) {
    console.log(userId);

    return await this.notificationRepo.findNotifByUser(userId);
  }

  async fetchUnreadNotifForUser(userId: number) {
    const items = this.notificationRepo.findAll({
      where: {
        userId: userId,
        read: false,
      },
    });
    return {
      count: (await items).length,
      userId: userId,
    };
  }

  @OnEvent('notification.read', { async: true })
  handleNotificationRead(payload: NotificationReadEvent) {
    const { ids } = payload;
    this.markNotificationsRead(ids);
  }

  async markNotificationsRead(ids: number[]): Promise<void> {
    // Fetch and update each notification individually
    for (const id of ids) {
      const notificationToUpdate = await this.notificationRepo.findOne({
        where: {
          id: id,
        },
      });
      if (notificationToUpdate) {
        notificationToUpdate.read = true;
        await this.notificationRepo.save(notificationToUpdate);
      }
    }
  }
}
