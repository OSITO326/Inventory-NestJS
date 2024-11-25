import { PartialType } from '@nestjs/mapped-types';
import { CreateTrademarkDto } from './create-trademark.dto';

export class UpdateTrademarkDto extends PartialType(CreateTrademarkDto) {}
