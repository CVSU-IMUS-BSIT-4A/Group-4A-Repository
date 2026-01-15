import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto, OrderItemDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  userId?: number;
  items?: OrderItemDto[];
}
