import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { MAX_HOURS_PER_DAY } from '../constants';

@Injectable()
export class EntriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.timeEntry.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: number) {
    const entry = await this.prisma.timeEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      throw new NotFoundException(`Entry with ID ${id} not found`);
    }

    return entry;
  }

  async create(createEntryDto: CreateEntryDto) {
    const { date, hours } = createEntryDto;
    await this.validateDailyHours(date, hours);

    return this.prisma.timeEntry.create({
      data: {
        ...createEntryDto,
        date: new Date(date),
      },
    });
  }

  async update(id: number, updateEntryDto: UpdateEntryDto) {
    // Check if entry exists and get current values
    const currentEntry = await this.findOne(id);

    // If hours or date are being updated, validate total hours for the day
    if (updateEntryDto.hours !== undefined || updateEntryDto.date !== undefined) {
      const newDate = updateEntryDto.date || currentEntry.date.toISOString();
      const newHours = updateEntryDto.hours ?? currentEntry.hours;

      await this.validateDailyHours(newDate, newHours, id);
    }

    return this.prisma.timeEntry.update({
      where: { id },
      data: {
        ...updateEntryDto,
        date: updateEntryDto.date ? new Date(updateEntryDto.date) : undefined,
      },
    });
  }

  async remove(id: number) {
    // Check if entry exists
    await this.findOne(id);

    return this.prisma.timeEntry.delete({
      where: { id },
    });
  }

  private async validateDailyHours(
    date: string,
    hours: number,
    excludeEntryId?: number,
  ) {
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
        // Exclude the entry being updated
        ...(excludeEntryId && { id: { not: excludeEntryId } }),
      },
    });

    const totalHours = entriesForDay.reduce((sum, entry) => sum + entry.hours, 0);

    if (totalHours + hours > MAX_HOURS_PER_DAY) {
      throw new BadRequestException(
        `Total hours for a single day cannot exceed ${MAX_HOURS_PER_DAY} hours`,
      );
    }
  }
}
