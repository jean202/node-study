import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @Type(() => Number)
  @IsInt()
  @Min(1888)
  year: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  genres: string[];
}
