import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { MAX_HOURS_PER_DAY } from '../constants';

@Injectable()
export class EntriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    project?: string;
    startDate?: string;
    endDate?: string;
    page: number;
    limit: number;
  }) {
    const { project, startDate, endDate, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (project && project !== 'all') {
      where.project = project;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.timeEntry.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.timeEntry.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async getTotalHoursForDate(date: string) {
    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(entryDate);
    nextDay.setDate(entryDate.getDate() + 1);

    const aggregate = await this.prisma.timeEntry.aggregate({
      where: {
        date: {
          gte: entryDate,
          lt: nextDay,
        },
      },
      _sum: {
        hours: true,
      },
    });

    return { total: aggregate._sum.hours || 0 };
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
