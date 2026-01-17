import { IsDateString, IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';
import { MIN_HOURS_PER_ENTRY, MAX_HOURS_PER_DAY } from '../../constants';

export class CreateEntryDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  project: string;

  @IsNumber()
  @Min(MIN_HOURS_PER_ENTRY)
  @Max(MAX_HOURS_PER_DAY)
  hours: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
