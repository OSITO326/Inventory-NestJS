import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TrademarksService } from './trademarks.service';
import { CreateTrademarkDto } from './dto/create-trademark.dto';
import { UpdateTrademarkDto } from './dto/update-trademark.dto';

@Controller('trademarks')
export class TrademarksController {
  constructor(private readonly trademarksService: TrademarksService) {}

  @Post()
  create(@Body() createTrademarkDto: CreateTrademarkDto) {
    return this.trademarksService.create(createTrademarkDto);
  }

  @Get()
  findAll() {
    return this.trademarksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trademarksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrademarkDto: UpdateTrademarkDto,
  ) {
    return this.trademarksService.update(id, updateTrademarkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trademarksService.remove(id);
  }
}