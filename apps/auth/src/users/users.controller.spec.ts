import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserController } from './users.controller';

import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
describe('UsersController', () => {
  let controller: UserController;
  let userService: UsersService;
  const mockUserDTO: CreateUserDto = {
    username: 'user',
    password: 'test123',
    id: 1,
    salt: 'salt',
    joinedDate: new Date(),
  };

  const updatedMockUser: UpdateUserDto = {
    username: 'user1',
    password: 'test123-changed',
  };
  const hashedPassword = 'hashed_password';
  const mockService = {
    create: jest.fn(async (userBody: CreateUserDto) => {
      // Mocking bcrypt methods
      const genSaltSpy = jest
        .spyOn(bcrypt, 'genSalt')
        .mockResolvedValue('mock_salt' as never);
      const hashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValue(hashedPassword as never);

      // Mocking the return value of the create method
      const createdUser = {
        id: 1,
        ...userBody,
        password: hashedPassword,
        salt: 'mock_salt',
      };

      // Returning the created user
      return createdUser;
    }),
    findOne: jest.fn().mockResolvedValue(mockUserDTO),
    deleteById: jest.fn().mockResolvedValue(mockUserDTO),
    update: jest.fn((id: number, updatedMockUser: UpdateUserDto) => {
      return {
        id: 1,
        ...updatedMockUser,
      };
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockService)
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(mockService).toBeDefined();
  });
  it('should create user and return it back with an assigned id and hashed password', async () => {
    // Call the create method
    const createdUser = await controller.create(mockUserDTO);
    const { password, salt, ...expectedUser } = mockUserDTO;
    // Assert that the returned user object contains the hashed password and an assigned id
    expect(createdUser).toEqual({
      id: expect.any(Number),
      password: hashedPassword,
      salt: 'mock_salt',
      ...expectedUser,
    });
    expect(userService.create).toHaveBeenCalled();
  });

  it('getBookById', async () => {
    const result = await controller.findOne(1);
    expect(userService.findOne).toHaveBeenCalled();
    expect(result).toEqual(mockUserDTO);
  });
  it('updates existing book given id and UpdateUserDto', async () => {
    const result = await controller.update(1, updatedMockUser);
    expect(userService.update).toHaveBeenCalled();
    expect(result).toEqual({
      id: expect.any(Number),
      ...updatedMockUser,
    });
  });
});
