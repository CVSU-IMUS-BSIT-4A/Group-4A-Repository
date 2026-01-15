import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private moviesService: MoviesService,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    // Verify movie exists
    const movie = await this.moviesService.findOne(createReviewDto.movieId);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${createReviewDto.movieId} not found`);
    }

    const review = this.reviewsRepository.create(createReviewDto);
    const savedReview = await this.reviewsRepository.save(review);

    // Update average rating for the movie
    await this.updateMovieRating(createReviewDto.movieId);

    return savedReview;
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewsRepository.find({
      relations: ['movie'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByMovie(movieId: number): Promise<Review[]> {
    return await this.reviewsRepository.find({
      where: { movieId },
      relations: ['movie'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Review> {
    return await this.reviewsRepository.findOne({
      where: { id },
      relations: ['movie'],
    });
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    await this.reviewsRepository.update(id, updateReviewDto);
    const updatedReview = await this.findOne(id);

    // Update average rating if rating changed
    if (updateReviewDto.rating !== undefined) {
      await this.updateMovieRating(review.movieId);
    }

    return updatedReview;
  }

  async remove(id: number): Promise<void> {
    const review = await this.findOne(id);
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    const movieId = review.movieId;
    await this.reviewsRepository.delete(id);

    // Update average rating after deletion
    await this.updateMovieRating(movieId);
  }

  private async updateMovieRating(movieId: number): Promise<void> {
    const reviews = await this.findByMovie(movieId);
    
    if (reviews.length === 0) {
      await this.moviesService.update(movieId, { averageRating: 0 });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await this.moviesService.update(movieId, { averageRating });
  }
}
