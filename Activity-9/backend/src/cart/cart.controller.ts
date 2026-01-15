import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  add(@Body() dto: AddToCartDto) {
    return this.cartService.addToCart(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cart items' })
  get() {
    return this.cartService.getCart();
  }

  @Put(':productId')
  @ApiOperation({ summary: 'Update cart item by productId' })
  async update(@Param('productId') productId: string, @Body() dto: UpdateCartDto) {
    return this.cartService.updateCart(+productId, dto);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove cart item by productId' })
  async remove(@Param('productId') productId: string) {
    return this.cartService.removeCart(+productId);
  }
}
