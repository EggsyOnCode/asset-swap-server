import { Test, TestingModule } from '@nestjs/testing';
import { AdvertizedAssetsController } from './advertized-assets.controller';
import { AdvertizedAssetsService } from './advertized-assets.service';

describe('AdvertizedAssetsController', () => {
  let controller: AdvertizedAssetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvertizedAssetsController],
      providers: [AdvertizedAssetsService],
    }).compile();

    controller = module.get<AdvertizedAssetsController>(AdvertizedAssetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
