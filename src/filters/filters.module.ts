import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiltersService } from './filters.service';
import { FiltersController } from './filters.controller';
import { Profile } from '../profiles/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [FiltersController],
  providers: [FiltersService],
})
export class FiltersModule {}
