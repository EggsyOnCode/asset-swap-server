import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { CreateOrderDto } from './dtos/create-order-dto';
import { updateOrderDTO } from './dtos/update-order-dto';
import { JwtAuthGuard } from 'apps/auth/src/services/jwt-auth.guard';
import { OrderStateMachineService } from './services/ordersStateMachine';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { log } from 'console';
import { Order } from './entities/order.schema';
import { NotificationCreatedEvent } from './notifications/utils/events';
import { State } from './constants/state';
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private readonly orderStateMachineService: OrderStateMachineService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('seller/requested/:id')
  findSellerOrders(@Param('id') id: number) {
    return this.orderService.findSellerOrders(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('buyer/requested/:id')
  findBuyerOrders(@Param('id') id: number) {
    return this.orderService.findBuyerOrders(id);
  }

  //getters for state-filtered orders
  @UseGuards(JwtAuthGuard)
  @Get('seller/inspected/:id')
  findRequestedOrders(@Param('id') id: number) {
    return this.orderService.findApprovedSellerOrders(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('buyer/inspected/:id')
  findRequestedBuyerOrders(@Param('id') id: number) {
    return this.orderService.findApprovedBuyerOrders(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('seller/completed/:id')
  findCompletedOrders(@Param('id') id: number) {
    return this.orderService.findCompletedSellerOrders(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('buyer/completed/:id')
  findCompletedBuyerOrders(@Param('id') id: number) {
    return this.orderService.findCompletedBuyerOrders(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('buyer/cancelled/:id')
  findCancelledBuyerOrders(@Param('id') id: number) {
    return this.orderService.findCancelledBuyerOrders(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('seller/cancelled/:id')
  findCancelledSellerOrders(@Param('id') id: number) {
    return this.orderService.findCancelledSellerOrders(id);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.orderService.findOne(id);
  }
  @Post()
  async createOrder(@Body() orderDTO: CreateOrderDto) {
    try {
      log(orderDTO);
      const result: Order = await this.orderService.create(orderDTO);

      const notification: NotificationCreatedEvent = {
        data: {
          fromId: result.buyerId,
          orderId: result.id,
          toId: result.sellerId,
          read: false,
          msg: '',
        },
        names: {
          fromName: '',
          toName: '',
          assetModel: '',
        },
        kind: State.B_REQUESTED,
      };

      log(notification);
      this.eventEmitter.emit('notification.handle', notification);

      return result;
    } catch (error) {
      // Handle errors here
      log(error);
      throw new HttpException('Error creating order', error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('seller/:id')
  update(@Param('id') id: number, @Body() orderDTO: updateOrderDTO) {
    return this.orderService
      .update(id, orderDTO)
      .then((result: Order) => {
        const notification: NotificationCreatedEvent = {
          data: {
            fromId: result.sellerId,
            orderId: result.id,
            toId: result.buyerId,
            read: false,
            msg: '',
          },
          names: {
            fromName: '',
            toName: '',
            assetModel: '',
          },
          kind: orderDTO.state,
        };
        this.eventEmitter.emit('notification.handle', notification);
        return result;
      })
      .catch((error) => {
        // Handle errors here
        throw new HttpException(
          `error is ${error}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }

  @UseGuards(JwtAuthGuard)
  @Put('buyer/:id')
  async updateBuyer(@Param('id') id: number, @Body() orderDTO: updateOrderDTO) {
    try {
      const result: Order = await this.orderService.update(id, orderDTO);
      log(result);

      const notification: NotificationCreatedEvent = {
        data: {
          fromId: result.buyerId,
          orderId: result.id,
          toId: result.sellerId,
          read: false,
          msg: '',
        },
        names: {
          fromName: '',
          toName: '',
          assetModel: '',
        },
        kind: orderDTO.state,
      };

      log(notification);
      this.eventEmitter.emit('notification.handle', notification);

      return result;
    } catch (error) {
      // Handle errors here
      throw new HttpException(
        `Error ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.orderService.delete(id);
  }

  //async notification handling
  @OnEvent('notification.handle', { async: true })
  async handleNotification(notification: NotificationCreatedEvent) {
    const orderPromise: Promise<Order> = this.orderService.findOne(
      notification.data.orderId,
    );
    const order: Order = await orderPromise;
    notification.names.fromName = order.buyer.username;
    notification.names.toName = order.seller.username;
    notification.names.assetModel = order.asset.model;
    this.eventEmitter.emit('notification.create', notification);
    log('event emitted');
  }
}
