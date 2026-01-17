import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEntryDto } from './dto/create-entry.dto';

@Injectable()
export class EntriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.timeEntry.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async create(createEntryDto: CreateEntryDto) {
    const { date, hours } = createEntryDto;
    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(entryDate);
    nextDay.setDate(entryDate.getDate() + 1);

    // Check total hours for the day
    const entriesForDay = await this.prisma.timeEntry.findMany({
      where: {
        date: {
          gte: entryDate,
          lt: nextDay,
        },
      },
    });

    const totalHours = entriesForDay.reduce((sum, entry) => sum + entry.hours, 0);

    if (totalHours + hours > 24) {
      throw new BadRequestException('Total hours for a single day cannot exceed 24 hours');
    }

    return this.prisma.timeEntry.create({
      data: {
        ...createEntryDto,
        date: new Date(date),
      },
    });
  }
}
