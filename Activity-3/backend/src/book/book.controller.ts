import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.bookService.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.bookService.findAll(Number(page), Number(limit));
  }

  @Get('author/:authorId')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findByAuthor(@Param('authorId', ParseIntPipe) authorId: number, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.bookService.findByAuthor(authorId, Number(page), Number(limit));
  }

  @Get('category/:categoryId')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.bookService.findByCategory(categoryId, Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookDto) {
    return this.bookService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.remove(id);
  }
}
