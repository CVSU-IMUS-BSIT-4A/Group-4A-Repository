import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module';
import { ReviewsModule } from './reviews/reviews.module';
import { Movie } from './movies/entities/movie.entity';
import { Review } from './reviews/entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'movie_reviews.db',
      entities: [Movie, Review],
      synchronize: true,
    }),
    MoviesModule,
    ReviewsModule,
  ],
})
export class AppModule {}
