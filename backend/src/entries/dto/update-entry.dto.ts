import { IsDateString, IsNotEmpty, IsNumber, IsString, Min, Max, IsOptional } from 'class-validator';
import { MIN_HOURS_PER_ENTRY, MAX_HOURS_PER_DAY } from '../../constants';

export class UpdateEntryDto {
  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  project?: string;

  @IsNumber()
  @Min(MIN_HOURS_PER_ENTRY)
  @Max(MAX_HOURS_PER_DAY)
  @IsOptional()
  hours?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}
