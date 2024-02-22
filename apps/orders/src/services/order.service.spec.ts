import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../entities/order.schema';
import { State } from '../constants/state';
import { CreateOrderDto } from '../dtos/create-order-dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { OrdersController } from '../orders.controller';
import { OrderStateMachineService } from './ordersStateMachine';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  const mockOrdersList: CreateOrderDto[] = [
    {
      id: 1,
      buyerId: 12,
      sellerId: 10,
      assetId: 9,
      state: State.B_CANCELLED,
    },
  ];
  const mockRepository = {
    create: jest.fn((newOrder: CreateOrderDto) => {
      const existingOrder = mockOrdersList.find(
        (order) =>
          order.assetId === newOrder.assetId &&
          order.buyerId === newOrder.buyerId &&
          order.sellerId === newOrder.sellerId,
      );
      if (existingOrder) {
        throw new HttpException('Order already exists', HttpStatus.CONFLICT);
      } else {
        return {
          id: 2,
          ...newOrder,
        };
      }
    }),
  };

  const mockOrder: CreateOrderDto = {
    id: 1,
    buyerId: 12,
    sellerId: 10,
    assetId: 9,
    state: State.B_CANCELLED,
  };

  const mockService = {
    create: jest.fn((newOrder: CreateOrderDto) => {
      mockRepository.create(newOrder);
    }),
  };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockRepository,
        },
        {
          provide: OrderStateMachineService,
          useValue: {},
        },
      ],
    })
      .overrideProvider(OrdersService)
      .useValue(mockService)
      .compile();

    ordersService = app.get<OrdersService>(OrdersService);
  });

  describe('create orders', () => {
    it('should throw duplicate error if already exists', () => {
      expect(() => ordersService.create(mockOrder)).toThrow(
        new HttpException('Order already exists', HttpStatus.CONFLICT),
      );

      expect(ordersService.create).toHaveBeenCalled();
    });
  });
});
