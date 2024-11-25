import { Test, TestingModule } from '@nestjs/testing';
import { TrademarksController } from './trademarks.controller';
import { TrademarksService } from './trademarks.service';

describe('TrademarksController', () => {
  let controller: TrademarksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrademarksController],
      providers: [TrademarksService],
    }).compile();

    controller = module.get<TrademarksController>(TrademarksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
