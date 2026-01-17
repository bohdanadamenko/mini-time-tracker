import { PrismaService } from '../prisma.service';
import { CreateEntryDto } from './dto/create-entry.dto';
export declare class EntriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        date: Date;
        project: string;
        hours: number;
        description: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(createEntryDto: CreateEntryDto): Promise<{
        date: Date;
        project: string;
        hours: number;
        description: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
