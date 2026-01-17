import { EntriesService } from './entries.service';
import { CreateEntryDto } from './dto/create-entry.dto';
export declare class EntriesController {
    private readonly entriesService;
    constructor(entriesService: EntriesService);
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
