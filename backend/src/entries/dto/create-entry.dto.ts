import { IsDateString, IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateEntryDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  project: string;

  @IsNumber()
  @Min(0.1)
  @Max(24)
  hours: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
