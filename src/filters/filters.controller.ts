import { Controller, Get, UseGuards } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('filters')
@UseGuards(JwtAuthGuard)
export class FiltersController {
  constructor(private filtersService: FiltersService) {}

  @Get()
  getFilters() {
    return this.filtersService.getFilters();
  }
}
