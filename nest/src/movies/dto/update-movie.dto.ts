import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateMovieDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1888)
  year?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];
}
