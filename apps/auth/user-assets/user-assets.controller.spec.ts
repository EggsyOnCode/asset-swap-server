import { Test, TestingModule } from '@nestjs/testing';
import { UserAssetsController } from './user-assets.controller';
import { UserAssetsService } from './user-assets.service';

describe('UserAssetsController', () => {
  let controller: UserAssetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAssetsController],
      providers: [UserAssetsService],
    }).compile();

    controller = module.get<UserAssetsController>(UserAssetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
