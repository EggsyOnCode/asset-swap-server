import { BaseAbstractRepository } from '@app/database/abstract.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Order } from './entities/order.schema';

@Injectable()
export class orderRepository extends BaseAbstractRepository<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
    super(orderRepository);
  }

  async findBuyerOrders(buyerId: number) {
    try {
      const result = await this.orderRepository.find({
        where: { buyerId },
        select: ['createdAt', 'seller', 'buyer', 'asset'],
        relations: ['asset', 'seller', 'buyer'], // Corrected relation name to 'user'
        order: {
          createdAt: 'DESC', // or 'DESC' for descending order
        },
      });

      if (!result || result.length == 0) {
        throw new HttpException(
          `Buyer with id ${buyerId} not found or has no assets`,
          HttpStatus.NOT_FOUND,
        );
      }

      const transformedObject = {
        buyer: null, // Placeholder for buyer info
        assets: result.map((item) => ({
          asset: { ...item.asset, createdAt: item.createdAt },
          seller: { ...item.seller },
        })),
      };

      // Extract buyer info from the first item (assuming buyer info is the same for all items)
      if (result.length > 0) {
        transformedObject.buyer = { ...result[0].buyer };
      }

      return transformedObject;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        // Handle not found scenario
        return null;
      }
      // Handle other errors
      throw error;
    }
  }

  async findSellerOrders(sellerId: number) {
    try {
      const result = await this.orderRepository.find({
        where: { sellerId },
        select: ['createdAt', 'seller', 'buyer', 'asset'],
        relations: ['asset', 'seller', 'buyer'], // Corrected relation name to 'user'
        order: {
          createdAt: 'DESC', // or 'DESC' for descending order
        },
      });

      if (!result || result.length == 0) {
        throw new HttpException(
          `Buyer with id ${sellerId} not found or has no assets`,
          HttpStatus.NOT_FOUND,
        );
      }

      const transformedObject = {
        seller: null, // Placeholder for seller info
        assets: result.map((item) => ({
          asset: { ...item.asset, createdAt: item.createdAt },
          buyer: { ...item.buyer },
        })),
      };

      // Extract seller info from the first item (assuming seller info is the same for all items)
      if (result.length > 0) {
        transformedObject.seller = { ...result[0].buyer };
      }

      return transformedObject;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        // Handle not found scenario
        return null;
      }
      // Handle other errors
      throw error;
    }
  }
}
