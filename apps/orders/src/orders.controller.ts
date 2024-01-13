import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order-dto';
import { updateOrderDTO } from './dtos/update-order-dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

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

  @Put(':id')
  update(@Param('id') id: number, @Body() orderDTO: updateOrderDTO) {
    return this.orderService.update(id, orderDTO);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.orderService.delete(id);
  }
}
