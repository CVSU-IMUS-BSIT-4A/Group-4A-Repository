import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
  ) {}

  async create(data: Partial<Comment>) {
    const comment = this.repo.create(data);
    return this.repo.save(comment);
  }

  async findAllByPost(postId: number, page = 1, limit = 10) {
    const [data, total] = await this.repo.findAndCount({
      where: { post: { id: postId } },
      relations: ['author', 'post'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });
    const totalPages = Math.ceil(total / limit) || 1;
    return { data, total, page, limit, totalPages };
  }

  async findOne(id: number) {
    const comment = await this.repo.findOne({ 
      where: { id }, 
      relations: ['author', 'post'] 
    });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async update(id: number, data: Partial<Comment>) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Comment not found');
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id }, relations: ['author', 'post'] });
  }

  async remove(id: number) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Comment not found');
    await this.repo.delete(id);
  }
}


