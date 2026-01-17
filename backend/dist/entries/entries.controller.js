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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntriesController = void 0;
const common_1 = require("@nestjs/common");
const entries_service_1 = require("./entries.service");
const create_entry_dto_1 = require("./dto/create-entry.dto");
let EntriesController = class EntriesController {
    entriesService;
    constructor(entriesService) {
        this.entriesService = entriesService;
    }
    findAll() {
        return this.entriesService.findAll();
    }
    create(createEntryDto) {
        return this.entriesService.create(createEntryDto);
    }
};
exports.EntriesController = EntriesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EntriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_entry_dto_1.CreateEntryDto]),
    __metadata("design:returntype", void 0)
], EntriesController.prototype, "create", null);
exports.EntriesController = EntriesController = __decorate([
    (0, common_1.Controller)('entries'),
    __metadata("design:paramtypes", [entries_service_1.EntriesService])
], EntriesController);
//# sourceMappingURL=entries.controller.js.map