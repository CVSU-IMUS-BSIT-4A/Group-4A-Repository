import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PostEntity } from './post.entity';
import { User } from '../users/user.entity';

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

  async likePost(postId: number, userId: number) {
    const post = await this.repo.findOne({
      where: { id: postId },
      relations: ['likedBy', 'dislikedBy']
    });
    
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user already liked
    const alreadyLiked = post.likedBy?.some(user => user.id === userId);
    const alreadyDisliked = post.dislikedBy?.some(user => user.id === userId);

    // If already liked, remove like
    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter(user => user.id !== userId);
      post.likeCount = Math.max(0, post.likeCount - 1);
    } else {
      // Add like and remove dislike if exists
      if (!post.likedBy) post.likedBy = [];
      post.likedBy.push({ id: userId } as User);
      post.likeCount++;
      
      if (alreadyDisliked) {
        post.dislikedBy = post.dislikedBy.filter(user => user.id !== userId);
        post.dislikeCount = Math.max(0, post.dislikeCount - 1);
      }
    }

    return this.repo.save(post);
  }

  async dislikePost(postId: number, userId: number) {
    const post = await this.repo.findOne({
      where: { id: postId },
      relations: ['likedBy', 'dislikedBy']
    });
    
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user already disliked
    const alreadyDisliked = post.dislikedBy?.some(user => user.id === userId);
    const alreadyLiked = post.likedBy?.some(user => user.id === userId);

    // If already disliked, remove dislike
    if (alreadyDisliked) {
      post.dislikedBy = post.dislikedBy.filter(user => user.id !== userId);
      post.dislikeCount = Math.max(0, post.dislikeCount - 1);
    } else {
      // Add dislike and remove like if exists
      if (!post.dislikedBy) post.dislikedBy = [];
      post.dislikedBy.push({ id: userId } as User);
      post.dislikeCount++;
      
      if (alreadyLiked) {
        post.likedBy = post.likedBy.filter(user => user.id !== userId);
        post.likeCount = Math.max(0, post.likeCount - 1);
      }
    }

    return this.repo.save(post);
  }

  async getUserReaction(postId: number, userId: number): Promise<'like' | 'dislike' | null> {
    const post = await this.repo.findOne({
      where: { id: postId },
      relations: ['likedBy', 'dislikedBy']
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.likedBy?.some(user => user.id === userId)) {
      return 'like';
    } else if (post.dislikedBy?.some(user => user.id === userId)) {
      return 'dislike';
    }
    
    return null;
  }
}


