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

  findBuyerOrders(buyerId: number) {
    return this.orderRepo.findBuyerOrders(buyerId);
  }

  findSellerOrders(sellerId: number) {
    return this.orderRepo.findSellerOrders(sellerId);
  }

  findOne(id: number) {
    return this.orderRepo.findOne({
      where: { id },
      relations: ['seller', 'buyer', 'asset'],
    });
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
