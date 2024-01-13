import { Injectable } from '@nestjs/common';
import { orderRepository } from './order.repository';
import { CreateOrderDto } from './dtos/create-order-dto';
import { updateOrderDTO } from './dtos/update-order-dto';

@Injectable()
export class OrdersService {
  constructor(private readonly orderRepo: orderRepository) {}

  findAll() {
    return this.orderRepo.findAll();
  }

  findOne(id: number) {
    return this.orderRepo.findOne({ where: { id } });
  }

  async create(userDto: CreateOrderDto) {
    const item = await this.orderRepo.save(userDto);
    return item;
  }

  async update(id: number, updatedOrder: updateOrderDTO) {
    const item = await this.orderRepo.findOne({
      where: { id },
    });
    return this.orderRepo.save({
      ...item, // existing fields
      ...updatedOrder, // updated fields
    });
  }

  async delete(id: number) {
    const item = await this.orderRepo.findOne({
      where: { id },
    });
    return this.orderRepo.remove(item);
  }
}
