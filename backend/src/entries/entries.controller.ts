import { Controller, Get, Post, Body } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { CreateEntryDto } from './dto/create-entry.dto';

@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Get()
  findAll() {
    return this.entriesService.findAll();
  }

  @Post()
  create(@Body() createEntryDto: CreateEntryDto) {
    return this.entriesService.create(createEntryDto);
  }
}
