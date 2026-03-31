import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  private readonly movies: Movie[] = [];
  private nextId = 1;

  create(createMovieDto: CreateMovieDto): Movie {
    const movie: Movie = {
      id: this.nextId++,
      ...createMovieDto,
    };

    this.movies.push(movie);
    return movie;
  }

  findAll(): Movie[] {
    return this.movies;
  }

  findOne(id: number): Movie {
    const movie = this.movies.find((item) => item.id === id);

    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    return movie;
  }

  update(id: number, updateMovieDto: UpdateMovieDto): Movie {
    const movie = this.findOne(id);
    Object.assign(movie, updateMovieDto);
    return movie;
  }

  remove(id: number): void {
    const index = this.movies.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    this.movies.splice(index, 1);
  }
}
