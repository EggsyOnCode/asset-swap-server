import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order-dto';

export class updateOrderDTO extends PartialType(CreateOrderDto) {}
