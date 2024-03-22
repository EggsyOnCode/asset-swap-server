import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationRepository } from './notification.repository';
import { OnEvent } from '@nestjs/event-emitter';
import { State } from '../constants/state';
import { NotificationCreatedEvent } from './utils/events';
import { log } from 'console';

export class NotificationReadEvent {
  constructor(public ids: number[]) {}
}

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationRepo: NotificationRepository) {}
  async create(notification: NotificationCreatedEvent) {
    const msg = await this.msgConstructor(
      notification.names.fromName,
      notification.names.assetModel,
      notification.names.toName,
      notification.kind,
    );
    const notif: CreateNotificationDto = {
      fromId: notification.data.fromId,
      toId: notification.data.toId,
      orderId: notification.data.orderId,
      msg: msg,
      read: false,
    };

    log(notif);

    const item = await this.notificationRepo.save(notif);
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
  // fetched unread notif and then marks them read
  async fetchNotificationsForUser(userId: number) {
    console.log(userId);

    return await this.notificationRepo.findNotifByUser(userId);
  }

  async fetchUnreadNotifForUser(userId: number) {
    const items = await this.notificationRepo.findAll({
      where: {
        toId: userId,
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

  //from and to are usernames, and asset is assetModel
  async msgConstructor(
    from: string,
    asset: string,
    to: string,
    kind: State,
  ): Promise<string> {
    let msg = '';

    switch (kind) {
      case State.B_REQUESTED:
        //will be received by seller
        msg = `Order ${asset} requested by ${from}`;
        break;
      case State.S_APPROVED:
        //will be received by buyer
        msg = `Order ${asset} approved by seller ${from}`;
        break;
      case State.B_DEPOSITED:
        //will be received by seller
        msg = `Funds deposited for order ${asset} by ${from}`;
        break;
      case State.S_INSPECTED:
        // will be recievd by buyer
        msg = `Seller ${from} has permitted inspection for order ${asset}`;
        break;
      case State.B_INSPECTED:
        msg = `Buyer has completed inspection for order ${asset}`;
        break;
      case State.B_CONFIRMED:
        msg = `Buyer has confirmed order ${asset}`;
        break;
      case State.S_CONFIRMED:
        msg = `Seller has confirmed order ${asset}`;
        break;
      case State.S_CANCELLED:
        msg = `Seller has cancelled order ${asset}`;
        break;
      case State.B_CANCELLED:
        msg = `Buyer has cancelled order ${asset}`;
        break;
      case State.COMPLETED:
        msg = `Order ${asset} completed`;
        break;
      default:
        // Handle unknown state
        throw new Error(`Unknown state: ${kind}`);
    }

    return msg;
  }
}
