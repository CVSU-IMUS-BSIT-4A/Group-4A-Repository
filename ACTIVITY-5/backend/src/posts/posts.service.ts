import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly repo: Repository<PostEntity>,
  ) {}

  async create(data: Partial<PostEntity>) {
    const post = this.repo.create(data);
    return this.repo.save(post);
  }

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
      relations: ['author'],
    });
    const totalPages = Math.ceil(total / limit) || 1;
    return { data, total, page, limit, totalPages };
  }

  async findOne(id: number) {
    const post = await this.repo.findOne({ where: { id }, relations: ['author'] });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: number, data: Partial<PostEntity>) {
    const post = await this.findOne(id);
    Object.assign(post, data);
    return this.repo.save(post);
  }

  async remove(id: number) {
    await this.repo.delete(id);
  }
}


