import {
  Body,
  Controller,
  Delete,
  Get,
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

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private readonly orderStateMachineService: OrderStateMachineService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('seller/:id')
  findSellerOrders(@Param('id') id: number) {
    return this.orderService.findSellerOrders(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('buyer/:id')
  findBuyerOrders(@Param('id') id: number) {
    return this.orderService.findBuyerOrders(id);
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
  create(@Body() orderDTO: CreateOrderDto) {
    return this.orderService.create(orderDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() orderDTO: updateOrderDTO) {
    return this.orderService.update(id, orderDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.orderService.delete(id);
  }

  //regarding state changes

  @Put('/request/:buyerId/:orderId')
  async requestOrder(
    @Param('buyerId') buyerId: number,
    @Param('orderId') orderId: number,
  ) {
    // Fetch order from the database

    const order = await this.orderService.findOne(orderId);

    // Transition the order to the requested state
    this.orderStateMachineService.transitionToRequested(order);

    // Save the updated order in the database
    this.orderService.saveUpdatedOrder(order);

    return `Order ${orderId} requested by buyer ${buyerId}`;
  }

  @Put('/accept/:sellerId/:orderId')
  async acceptOrder(
    @Param('sellerId') sellerId: number,
    @Param('orderId') orderId: number,
  ) {
    // Fetch order from the database
    const order = await this.orderService.findOne(orderId);

    // Transition the order to the accepted state
    this.orderStateMachineService.transitionToAccepted(order);

    // Save the updated order in the database
    this.orderService.saveUpdatedOrder(order);

    return `Order ${orderId} accepted by seller ${sellerId}`;
  }

  @Put('/cancel/buyer/:buyerId/:orderId')
  async cancelOrderByBuyer(
    @Param('buyerId') buyerId: number,
    @Param('orderId') orderId: number,
  ) {
    // Fetch order from the database
    const order = await this.orderService.findOne(orderId);

    // Transition the order to the cancelled state
    this.orderStateMachineService.transitionToCancelled(order);

    // Save the updated order in the database
    this.orderService.saveUpdatedOrder(order);

    return `Order ${orderId} cancelled by buyer ${buyerId}`;
  }

  @Put('/cancel/seller/:sellerId/:orderId')
  async cancelOrderBySeller(
    @Param('sellerId') sellerId: number,
    @Param('orderId') orderId: number,
  ) {
    // Fetch order from the database
    const order = await this.orderService.findOne(orderId);

    // Transition the order to the cancelled state
    this.orderStateMachineService.transitionToCancelled(order);

    // Save the updated order in the database
    this.orderService.saveUpdatedOrder(order);

    return `Order ${orderId} cancelled by seller ${sellerId}`;
  }

  @Put('/deposit/:buyerId/:orderId')
  async deposit(
    @Param('buyerId') buyerId: number,
    @Param('orderId') orderId: number,
  ) {
    // Fetch order from the database
    const order = await this.orderService.findOne(orderId);

    // Transition the order to the inspected state
    this.orderStateMachineService.transitionToInspected(order);

    // Save the updated order in the database
    this.orderService.saveUpdatedOrder(order);

    return `Deposit confirmed for order ${orderId} by buyer ${buyerId}`;
  }

  @Put('/confirm/buyer/:buyerId/:orderId')
  async confirmOrderByBuyer(
    @Param('buyerId') buyerId: number,
    @Param('orderId') orderId: number,
  ) {
    // Fetch order from the database
    const order = await this.orderService.findOne(orderId);

    // Transition the order to the seller confirmation pending state
    this.orderStateMachineService.transitionToSellerConfPending(order);

    // Save the updated order in the database
    this.orderService.saveUpdatedOrder(order);

    return `Buyer ${buyerId} confirmed order ${orderId}`;
  }

  @Put('/confirm/seller/:sellerId/:orderId')
  async confirmOrderBySeller(
    @Param('sellerId') sellerId: number,
    @Param('orderId') orderId: number,
  ) {
    // Fetch order from the database
    const order = await this.orderService.findOne(orderId);

    // Transition the order to the completed state
    this.orderStateMachineService.transitionToCompleted(order);

    // Save the updated order in the database
    this.orderService.saveUpdatedOrder(order);

    return `Seller ${sellerId} confirmed order ${orderId}`;
  }
}
