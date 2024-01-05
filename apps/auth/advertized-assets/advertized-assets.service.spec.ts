import { Test, TestingModule } from '@nestjs/testing';
import { AdvertizedAssetsService } from './advertized-assets.service';

describe('AdvertizedAssetsService', () => {
  let service: AdvertizedAssetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvertizedAssetsService],
    }).compile();

    service = module.get<AdvertizedAssetsService>(AdvertizedAssetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
