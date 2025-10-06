import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Author } from '../authors/entities/author.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const author = await this.authorRepository.findOneBy({ id: createBookDto.author });
    if (!author) throw new NotFoundException('Author not found');

    const category = await this.categoryRepository.findOneBy({ id: createBookDto.category });
    if (!category) throw new NotFoundException('Category not found');

    const book = this.bookRepository.create({
      title: createBookDto.title,
      description: createBookDto.description,
      author,
      category,
    });

    return this.bookRepository.save(book);
  }

  findAll() {
    return this.bookRepository.find({ relations: ['author', 'category'] });
  }

  findOne(id: number) {
    return this.bookRepository.findOne({ where: { id }, relations: ['author', 'category'] });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.findOne({ where: { id }, relations: ['author', 'category'] });
    if (!book) throw new NotFoundException('Book not found');

    if (updateBookDto.title) book.title = updateBookDto.title;
    if (updateBookDto.description) book.description = updateBookDto.description;

    if (updateBookDto.author) {
      const author = await this.authorRepository.findOneBy({ id: updateBookDto.author });
      if (!author) throw new NotFoundException('Author not found');
      book.author = author;
    }

    if (updateBookDto.category) {
      const category = await this.categoryRepository.findOneBy({ id: updateBookDto.category });
      if (!category) throw new NotFoundException('Category not found');
      book.category = category;
    }

    return this.bookRepository.save(book);
  }

  async remove(id: number) {
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Book not found');
    return { deleted: true };
  }
}
