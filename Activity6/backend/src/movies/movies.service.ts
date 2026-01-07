import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.moviesRepository.create(createMovieDto);
    return await this.moviesRepository.save(movie);
  }

  async findAll(): Promise<Movie[]> {
    return await this.moviesRepository.find({
      relations: ['reviews'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Movie> {
    return await this.moviesRepository.findOne({
      where: { id },
      relations: ['reviews'],
    });
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    await this.moviesRepository.update(id, updateMovieDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.moviesRepository.delete(id);
  }
}
