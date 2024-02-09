import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationsService {
  constructor(private readonly notifcationRepo: NotificationRepository) {}
  async create(createNotificationDto: CreateNotificationDto) {
    return await this.notifcationRepo.save(createNotificationDto);
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
}
