import { Test, TestingModule } from '@nestjs/testing';
import { TrademarksService } from './trademarks.service';

describe('TrademarksService', () => {
  let service: TrademarksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrademarksService],
    }).compile();

    service = module.get<TrademarksService>(TrademarksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
