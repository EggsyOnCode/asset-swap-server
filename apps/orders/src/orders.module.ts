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

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/orders/.env',
    }),
    TypeOrmModule.forFeature([Order]),
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, orderRepository, OrderStateMachineService],
})
export class OrdersModule {}
