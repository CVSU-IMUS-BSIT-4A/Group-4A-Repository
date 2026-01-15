import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Review } from '../../reviews/entities/review.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  genre: string;

  @Column()
  imageUrl: string;

  @Column({ type: 'int', default: 0 })
  releaseYear: number;

  @OneToMany(() => Review, (review) => review.movie)
  reviews: Review[];

  @Column({ type: 'real', default: 0 })
  averageRating: number;
}
