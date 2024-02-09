import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationRepository } from './notification.repository';
import { OnEvent } from '@nestjs/event-emitter';
import { log } from 'console';

export class NotificationReadEvent {
  constructor(public ids: number[]) {}
}

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

  async fetchUnreadNotifForUser(userId: number) {
    const items = this.notifcationRepo.findAll({
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
      const notificationToUpdate = await this.notifcationRepo.findOne({
        where: {
          id: id,
        },
      });
      if (notificationToUpdate) {
        notificationToUpdate.read = true;
        await this.notifcationRepo.save(notificationToUpdate);
      }
    }
  }
}
