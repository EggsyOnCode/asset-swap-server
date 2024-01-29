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
    const order = await this.orderService.findOne(orderId);
    this.orderStateMachineService.transitionToBuyerRequested(order);
    this.orderService.saveUpdatedOrder(order);
    return `Order ${orderId} requested by buyer ${buyerId}`;
  }

  @Put('/approve/:sellerId/:orderId')
  async approveOrder(
    @Param('sellerId') sellerId: number,
    @Param('orderId') orderId: number,
  ) {
    const order = await this.orderService.findOne(orderId);
    this.orderStateMachineService.transitionToSellerApproved(order);
    this.orderService.saveUpdatedOrder(order);
    return `Order ${orderId} approved by seller ${sellerId}`;
  }

  @Put('/deposit/:buyerId/:orderId')
  async deposit(
    @Param('buyerId') buyerId: number,
    @Param('orderId') orderId: number,
  ) {
    const order = await this.orderService.findOne(orderId);
    this.orderStateMachineService.transitionToBuyerDeposited(order);
    this.orderService.saveUpdatedOrder(order);
    return `Deposit confirmed for order ${orderId} by buyer ${buyerId}`;
  }

  @Put('/inspect/:orderId')
  async inspect(@Param('orderId') orderId: number) {
    const order = await this.orderService.findOne(orderId);
    this.orderStateMachineService.transitionToSellerInspected(order);
    this.orderService.saveUpdatedOrder(order);
    return `Order ${orderId} inspected by seller`;
  }

  @Put('/complete-inspection/:orderId')
  async completeInspection(@Param('orderId') orderId: number) {
    const order = await this.orderService.findOne(orderId);
    this.orderStateMachineService.transitionToBuyerInspectionCompletion(order);
    this.orderService.saveUpdatedOrder(order);
    return `Buyer has completed inspection for order ${orderId}`;
  }

  @Put('/confirm-buyer/:buyerId/:orderId')
  async confirmOrder(
    @Param('buyerId') buyerId: number,
    @Param('orderId') orderId: number,
  ) {
    const order = await this.orderService.findOne(orderId);
    this.orderStateMachineService.transitionToBuyerConfirmed(order);
    this.orderService.saveUpdatedOrder(order);
    return `Buyer ${buyerId} confirmed order ${orderId}`;
  }

  @Put('/confirm-seller/:sellerId/:orderId')
  async confirmOrderBySeller(
    @Param('sellerId') sellerId: number,
    @Param('orderId') orderId: number,
  ) {
    const order = await this.orderService.findOne(orderId);
    this.orderStateMachineService.transitionToSellerConfirmed(order);
    this.orderService.saveUpdatedOrder(order);
    return `Seller ${sellerId} confirmed order ${orderId}`;
  }

  @Put('/cancel/seller/:sellerId/:orderId')
  async cancelOrderBySeller(
    @Param('sellerId') sellerId: number,
    @Param('orderId') orderId: number,
  ) {
    const order = await this.orderService.findOne(orderId);
    this.orderStateMachineService.transitionToSellerCancelled(order);
    this.orderService.saveUpdatedOrder(order);
    return `Order ${orderId} cancelled by seller ${sellerId}`;
  }

  @Put('/cancel/buyer/:buyerId/:orderId')
  async cancelOrderByBuyer(
    @Param('buyerId') buyerId: number,
    @Param('orderId') orderId: number,
  ) {
    const order = await this.orderService.findOne(orderId);
    this.orderStateMachineService.transitionToBuyerCancelled(order);
    this.orderService.saveUpdatedOrder(order);
    return `Order ${orderId} cancelled by buyer ${buyerId}`;
  }

  @Put('/complete/:orderId')
  async completeOrder(@Param('orderId') orderId: number) {
    const order = await this.orderService.findOne(orderId);
    this.orderStateMachineService.transitionToCompleted(order);
    this.orderService.saveUpdatedOrder(order);
    return `Order ${orderId} completed`;
  }
}
