"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let EntriesService = class EntriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.timeEntry.findMany({
            orderBy: { date: 'desc' },
        });
    }
    async create(createEntryDto) {
        const { date, hours } = createEntryDto;
        const entryDate = new Date(date);
        entryDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(entryDate);
        nextDay.setDate(entryDate.getDate() + 1);
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
            throw new common_1.BadRequestException('Total hours for a single day cannot exceed 24 hours');
        }
        return this.prisma.timeEntry.create({
            data: {
                ...createEntryDto,
                date: new Date(date),
            },
        });
    }
};
exports.EntriesService = EntriesService;
exports.EntriesService = EntriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EntriesService);
//# sourceMappingURL=entries.service.js.map