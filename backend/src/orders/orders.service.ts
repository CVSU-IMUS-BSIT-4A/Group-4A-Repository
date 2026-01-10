// src/orders/orders.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private productsService: ProductsService,
  ) {}

  // CREATE order
  async create(dto: CreateOrderDto) {
    const items: OrderItem[] = [];

    for (const itemDto of dto.items) {
      const product = await this.productsService.findOne(itemDto.productId);
      if (!product) throw new NotFoundException(`Product ${itemDto.productId} not found`);
      if (product.stock < itemDto.quantity) throw new BadRequestException(`Not enough stock for ${product.name}`);

      product.stock -= itemDto.quantity;
      await this.productsService.updateStock(product.id, product.stock);

      const orderItem = new OrderItem();
      orderItem.product = product;
      orderItem.quantity = itemDto.quantity;
      items.push(orderItem);
    }

    const order = this.ordersRepository.create({
      userId: dto.userId,
      items,
    });

    return this.ordersRepository.save(order);
  }

  // GET all orders
  findAll() {
    return this.ordersRepository.find({ relations: ['items', 'items.product'] });
  }

  // GET single order
  async findOne(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  // UPDATE order
  async update(id: number, dto: UpdateOrderDto) {
    const order = await this.findOne(id);

    if (dto.userId !== undefined) order.userId = dto.userId;

    if (dto.items !== undefined) {
      // Restore stock for old items
      for (const oldItem of order.items) {
        const product = oldItem.product;
        if (!product) continue;
        product.stock += oldItem.quantity;
        await this.productsService.updateStock(product.id, product.stock);
      }

      const newItems: OrderItem[] = [];

      for (const itemDto of dto.items) {
        const product = await this.productsService.findOne(itemDto.productId);
        if (!product) throw new NotFoundException(`Product ${itemDto.productId} not found`);
        if (product.stock < itemDto.quantity) throw new BadRequestException(`Not enough stock for ${product.name}`);

        product.stock -= itemDto.quantity;
        await this.productsService.updateStock(product.id, product.stock);

        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.quantity = itemDto.quantity;
        newItems.push(orderItem);
      }

      order.items = newItems;
    }

    return this.ordersRepository.save(order);
  }

  // DELETE order
  async remove(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!order) throw new NotFoundException('Order not found');

    // Restore stock safely
    for (const item of order.items) {
      const product = item.product;
      if (!product) continue;
      product.stock += item.quantity;
      await this.productsService.updateStock(product.id, product.stock);
    }

    // This works because of cascade delete on Order entity
    await this.ordersRepository.remove(order);

    return order; // return deleted order for Swagger
  }
}
