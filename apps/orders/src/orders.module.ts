import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/shared';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.schema';
import { orderRepository } from './order.repository';
import { OrdersController } from './orders.controller';
import { OrdersService } from './services/orders.service';
import { AuthModule } from 'apps/auth/src/auth.module';
import { OrderStateMachineService } from './services/ordersStateMachine';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/entities/notification.schema';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    DatabaseModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/orders/.env',
    }),
    TypeOrmModule.forFeature([Order, Notification]),
    NotificationsModule,
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, orderRepository, OrderStateMachineService],
  exports: [OrdersService],
})
export class OrdersModule {}
