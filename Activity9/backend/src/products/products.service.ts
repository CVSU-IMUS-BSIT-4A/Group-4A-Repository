import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  create(dto: CreateProductDto) {
    const product = this.productsRepository.create(dto);
    return this.productsRepository.save(product);
  }

  findAll() {
    return this.productsRepository.find();
  }

  findOne(id: number) {
    return this.productsRepository.findOne({ where: { id } });
  }

  update(id: number, dto: UpdateProductDto) {
    return this.productsRepository.update(id, dto);
  }

  remove(id: number) {
    return this.productsRepository.delete(id);
  }

  async updateStock(id: number, stock: number) {
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException('Product not found');
    product.stock = stock;
    return this.productsRepository.save(product);
  }
}
