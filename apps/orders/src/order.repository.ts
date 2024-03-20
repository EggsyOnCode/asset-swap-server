import { BaseAbstractRepository } from '@app/database/abstract.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, In, Repository } from 'typeorm';
import { Order } from './entities/order.schema';
import { State } from './constants/state';

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
        where: { buyerId, state: State.B_REQUESTED },
        select: [
          'createdAt',
          'seller',
          'buyer',
          'asset',
          'state',
          'id',
          'orderManagerContract',
          'nftContract',
          'cryptoPrice',
        ],
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
        buyer: null,
        assets: result.map((item) => ({
          asset: {
            ...item.asset,
            createdAt: item.createdAt,
            state: item.state,
          },
          seller: {
            id: item.seller.id,
            username: item.seller.username,
            walletAddress: item.seller.walletAddress,
          }, // Retain seller info as is
          orderId: item.id,
          orderManager: item.orderManagerContract,
          nftContract: item.nftContract,
          cryptoPrice: item.cryptoPrice,
        })),
      };

      // Extract buyer info from the first item (assuming buyer info is the same for all items)
      if (result.length > 0) {
        transformedObject.buyer = {
          id: result[0].buyer.id,
          username: result[0].buyer.username,
          walletAddress: result[0].buyer.walletAddress,
          // Add other non-sensitive properties here if needed
        };
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

  async findApprovedBuyerOrders(buyerId: number) {
    try {
      const result = await this.orderRepository.find({
        where: {
          buyerId,
          state: In([
            State.S_APPROVED,
            State.B_DEPOSITED,
            State.B_INSPECTED,
            State.B_CONFIRMED,
            State.S_INSPECTED,
            State.S_CONFIRMED,
          ]),
        },
        select: [
          'createdAt',
          'seller',
          'buyer',
          'asset',
          'state',
          'id',
          'orderManagerContract',
          'nftContract',
          'cryptoPrice',
        ],
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
        buyer: null,
        assets: result.map((item) => ({
          asset: {
            ...item.asset,
            createdAt: item.createdAt,
            state: item.state,
          },
          seller: {
            id: item.seller.id,
            username: item.seller.username,
            walletAddress: item.seller.walletAddress,
          }, // Retain seller info as is
          orderId: item.id,
          orderManager: item.orderManagerContract,
          nftContract: item.nftContract,
          cryptoPrice: item.cryptoPrice,
        })),
      };

      // Extract buyer info from the first item (assuming buyer info is the same for all items)
      if (result.length > 0) {
        transformedObject.buyer = {
          id: result[0].buyer.id,
          username: result[0].buyer.username,
          walletAddress: result[0].buyer.walletAddress,
          // Add other non-sensitive properties here if needed
        };
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

  async findCancelledBuyerOrders(buyerId: number) {
    try {
      const result = await this.orderRepository.find({
        where: { buyerId, state: State.B_CANCELLED },
        select: [
          'createdAt',
          'seller',
          'buyer',
          'asset',
          'state',
          'id',
          'orderManagerContract',
          'nftContract',
        ],
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
        buyer: null,
        assets: result.map((item) => ({
          asset: {
            ...item.asset,
            createdAt: item.createdAt,
            state: item.state,
          },
          seller: {
            id: item.seller.id,
            username: item.seller.username,
            walletAddress: item.seller.walletAddress,
          }, // Retain seller info as is
          orderId: item.id,
          orderManager: item.orderManagerContract,
          nftContract: item.nftContract,
        })),
      };

      // Extract buyer info from the first item (assuming buyer info is the same for all items)
      if (result.length > 0) {
        transformedObject.buyer = {
          id: result[0].buyer.id,
          username: result[0].buyer.username,
          walletAddress: result[0].buyer.walletAddress,
          // Add other non-sensitive properties here if needed
        };
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
  async findCompletedBuyerOrders(buyerId: number) {
    try {
      const result = await this.orderRepository.find({
        where: { buyerId, state: State.COMPLETED },
        select: [
          'createdAt',
          'seller',
          'buyer',
          'asset',
          'state',
          'id',
          'orderManagerContract',
          'nftContract',
        ],
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
        buyer: null,
        assets: result.map((item) => ({
          asset: {
            ...item.asset,
            createdAt: item.createdAt,
            state: item.state,
          },
          seller: {
            id: item.seller.id,
            username: item.seller.username,
            walletAddress: item.seller.walletAddress,
          }, // Retain seller info as is
          orderId: item.id,
          orderManager: item.orderManagerContract,
          nftContract: item.nftContract,
        })),
      };

      // Extract buyer info from the first item (assuming buyer info is the same for all items)
      if (result.length > 0) {
        transformedObject.buyer = {
          id: result[0].buyer.id,
          username: result[0].buyer.username,
          walletAddress: result[0].buyer.walletAddress,
          // Add other non-sensitive properties here if needed
        };
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
        where: { sellerId, state: State.B_REQUESTED },
        select: [
          'createdAt',
          'seller',
          'buyer',
          'asset',
          'state',
          'id',
          'orderManagerContract',
          'nftContract',
        ],
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

      const transformedSeller = {
        id: result[0].seller.id,
        username: result[0].seller.username,
        joinedDate: result[0].seller.joinedDate,
        walletAddress: result[0].seller.walletAddress,
      };

      const transformedAssets = result.map((item) => ({
        asset: { ...item.asset, createdAt: item.createdAt, state: item.state },
        buyer: {
          id: item.buyer.id,
          username: item.buyer.username,
          walletAddress: item.buyer.walletAddress,
        },
        orderId: item.id,
        orderManager: item.orderManagerContract,
        nftContract: item.nftContract,
      }));

      return {
        seller: transformedSeller,
        assets: transformedAssets,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        // Handle not found scenario
        return null;
      }
      // Handle other errors
      throw error;
    }
  }
  async findCancelledSellerOrders(sellerId: number) {
    try {
      const result = await this.orderRepository.find({
        where: { sellerId, state: State.S_CANCELLED },
        select: [
          'createdAt',
          'seller',
          'buyer',
          'asset',
          'state',
          'id',
          'orderManagerContract',
          'nftContract',
        ],
        relations: ['asset', 'seller', 'buyer'], // Corrected relation name to 'user'
        order: {
          createdAt: 'DESC', // or 'DESC' for descending order
        },
      });

      if (!result || result.length == 0) {
        throw new HttpException(
          `Seller with id ${sellerId} not found or has no assets`,
          HttpStatus.NOT_FOUND,
        );
      }

      const transformedSeller = {
        id: result[0].seller.id,
        username: result[0].seller.username,
        joinedDate: result[0].seller.joinedDate,
        walletAddress: result[0].seller.walletAddress,
      };

      const transformedAssets = result.map((item) => ({
        asset: { ...item.asset, createdAt: item.createdAt, state: item.state },
        buyer: {
          id: item.buyer.id,
          username: item.buyer.username,
          walletAddress: item.buyer.walletAddress,
        },
        orderId: item.id,
        orderManager: item.orderManagerContract,
        nftContract: item.nftContract,
      }));

      return {
        seller: transformedSeller,
        assets: transformedAssets,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        // Handle not found scenario
        return null;
      }
      // Handle other errors
      throw error;
    }
  }
  async findApprovedSellerOrders(sellerId: number) {
    try {
      const result = await this.orderRepository.find({
        where: {
          sellerId,
          state: In([
            State.S_APPROVED,
            State.B_DEPOSITED,
            State.B_INSPECTED,
            State.B_CONFIRMED,
            State.S_INSPECTED,
            State.S_CONFIRMED,
          ]),
        },
        select: [
          'createdAt',
          'seller',
          'buyer',
          'asset',
          'state',
          'id',
          'orderManagerContract',
          'nftContract',
          'cryptoPrice',
        ],
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

      const transformedSeller = {
        id: result[0].seller.id,
        username: result[0].seller.username,
        joinedDate: result[0].seller.joinedDate,
        walletAddress: result[0].seller.walletAddress,
      };

      const transformedAssets = result.map((item) => ({
        asset: { ...item.asset, createdAt: item.createdAt, state: item.state },
        buyer: {
          id: item.buyer.id,
          username: item.buyer.username,
          walletAddress: item.buyer.walletAddress,
        },
        orderId: item.id,
        orderManager: item.orderManagerContract,
        nftContract: item.nftContract,
        cryptoPrice: item.cryptoPrice,
      }));

      return {
        seller: transformedSeller,
        assets: transformedAssets,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        // Handle not found scenario
        return null;
      }
      // Handle other errors
      throw error;
    }
  }

  async findCompletedSellerOrders(sellerId: number) {
    try {
      const result = await this.orderRepository.find({
        where: { sellerId, state: State.COMPLETED },
        select: [
          'createdAt',
          'seller',
          'buyer',
          'asset',
          'state',
          'id',
          'orderManagerContract',
          'nftContract',
          'cryptoPrice',
        ],
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

      const transformedSeller = {
        id: result[0].seller.id,
        username: result[0].seller.username,
        joinedDate: result[0].seller.joinedDate,
        walletAddress: result[0].seller.walletAddress,
      };

      const transformedAssets = result.map((item) => ({
        asset: { ...item.asset, createdAt: item.createdAt, state: item.state },
        buyer: {
          id: item.buyer.id,
          username: item.buyer.username,
          walletAddress: item.buyer.walletAddress,
        },
        orderId: item.id,
        orderManager: item.orderManagerContract,
        nftContract: item.nftContract,
      }));

      return {
        seller: transformedSeller,
        assets: transformedAssets,
      };
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
