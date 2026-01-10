// src/orders/entities/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  // Cascade saves and deletes to order items
  @OneToMany(() => OrderItem, item => item.order, { cascade: true, onDelete: 'CASCADE' })
  items: OrderItem[];
}
