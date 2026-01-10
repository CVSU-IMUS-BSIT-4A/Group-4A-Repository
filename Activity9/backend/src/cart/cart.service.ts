import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  private cart: any[] = [];

  constructor(private productsService: ProductsService) {}

  async addToCart(dto: AddToCartDto) {
    const product = await this.productsService.findOne(dto.productId);
    if (!product) throw new BadRequestException('Product not found');
    if (product.stock < dto.quantity) throw new BadRequestException('Not enough stock');

    const existing = this.cart.find(i => i.productId === product.id);
    if (existing) {
      if (product.stock < existing.quantity + dto.quantity)
        throw new BadRequestException('Not enough stock');
      existing.quantity += dto.quantity;
      return existing; // return updated cart item
    } else {
      const newItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: dto.quantity,
      };
      this.cart.push(newItem);
      return newItem;
    }
  }

  getCart() {
    return this.cart;
  }

  async updateCart(productId: number, dto: UpdateCartDto) {
    const item = this.cart.find(i => i.productId === productId);
    if (!item) throw new NotFoundException('Cart item not found');

    // Update quantity
    if (dto.quantity !== undefined) {
      const product = await this.productsService.findOne(item.productId);
      if (!product) throw new NotFoundException('Product not found');
      if (product.stock < dto.quantity) throw new BadRequestException('Not enough stock');
      item.quantity = dto.quantity;
    }

    // Update productId (swap product)
    if (dto.productId !== undefined && dto.productId !== item.productId) {
      const product = await this.productsService.findOne(dto.productId);
      if (!product) throw new NotFoundException('Product not found');
      if (product.stock < (dto.quantity ?? item.quantity)) throw new BadRequestException('Not enough stock');
      item.productId = product.id;
      item.name = product.name;
      item.price = product.price;
      if (dto.quantity !== undefined) item.quantity = dto.quantity;
    }

    return item; // return updated cart item
  }

  removeCart(productId: number) {
    const index = this.cart.findIndex(i => i.productId === productId);
    if (index === -1) throw new NotFoundException('Cart item not found');
    const removedItem = this.cart.splice(index, 1)[0];
    return removedItem; // return deleted cart item
  }

  clearCart() {
    this.cart = [];
    return this.cart;
  }
}
