import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from '../users/user.entity';

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

  async likeComment(commentId: number, userId: number) {
    const comment = await this.repo.findOne({
      where: { id: commentId },
      relations: ['likedBy', 'dislikedBy']
    });
    
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if user already liked
    const alreadyLiked = comment.likedBy?.some(user => user.id === userId);
    const alreadyDisliked = comment.dislikedBy?.some(user => user.id === userId);

    // If already liked, remove like
    if (alreadyLiked) {
      comment.likedBy = comment.likedBy.filter(user => user.id !== userId);
      comment.likeCount = Math.max(0, comment.likeCount - 1);
    } else {
      // Add like and remove dislike if exists
      if (!comment.likedBy) comment.likedBy = [];
      comment.likedBy.push({ id: userId } as User);
      comment.likeCount++;
      
      if (alreadyDisliked) {
        comment.dislikedBy = comment.dislikedBy.filter(user => user.id !== userId);
        comment.dislikeCount = Math.max(0, comment.dislikeCount - 1);
      }
    }

    return this.repo.save(comment);
  }

  async dislikeComment(commentId: number, userId: number) {
    const comment = await this.repo.findOne({
      where: { id: commentId },
      relations: ['likedBy', 'dislikedBy']
    });
    
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if user already disliked
    const alreadyDisliked = comment.dislikedBy?.some(user => user.id === userId);
    const alreadyLiked = comment.likedBy?.some(user => user.id === userId);

    // If already disliked, remove dislike
    if (alreadyDisliked) {
      comment.dislikedBy = comment.dislikedBy.filter(user => user.id !== userId);
      comment.dislikeCount = Math.max(0, comment.dislikeCount - 1);
    } else {
      // Add dislike and remove like if exists
      if (!comment.dislikedBy) comment.dislikedBy = [];
      comment.dislikedBy.push({ id: userId } as User);
      comment.dislikeCount++;
      
      if (alreadyLiked) {
        comment.likedBy = comment.likedBy.filter(user => user.id !== userId);
        comment.likeCount = Math.max(0, comment.likeCount - 1);
      }
    }

    return this.repo.save(comment);
  }

  async getUserReaction(commentId: number, userId: number): Promise<'like' | 'dislike' | null> {
    const comment = await this.repo.findOne({
      where: { id: commentId },
      relations: ['likedBy', 'dislikedBy']
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.likedBy?.some(user => user.id === userId)) {
      return 'like';
    } else if (comment.dislikedBy?.some(user => user.id === userId)) {
      return 'dislike';
    }
    
    return null;
  }
}


