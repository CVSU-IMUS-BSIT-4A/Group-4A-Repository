import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(book);
  }

  async findAll(page = 1, limit = 10): Promise<{ data: Book[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.bookRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
      relations: ['author', 'category'],
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ 
      where: { id },
      relations: ['author', 'category']
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    Object.assign(book, updateBookDto);
    return await this.bookRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
  }

  async findByAuthor(authorId: number, page = 1, limit = 10): Promise<{ data: Book[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.bookRepository.findAndCount({
      where: { authorId },
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
      relations: ['author', 'category'],
    });
    return { data, total, page, limit };
  }

  async findByCategory(categoryId: number, page = 1, limit = 10): Promise<{ data: Book[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.bookRepository.findAndCount({
      where: { categoryId },
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
      relations: ['author', 'category'],
    });
    return { data, total, page, limit };
  }
}
