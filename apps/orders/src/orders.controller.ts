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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order-dto';
import { updateOrderDTO } from './dtos/update-order-dto';
import { JwtAuthGuard } from 'apps/auth/src/services/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

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
}
