import { Test, TestingModule } from '@nestjs/testing';
import { AwsUtilsService } from './aws-utils.service';

describe('AwsUtilsService', () => {
  let service: AwsUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsUtilsService],
    }).compile();

    service = module.get<AwsUtilsService>(AwsUtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
