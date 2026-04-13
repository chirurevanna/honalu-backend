import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../profiles/entities/profile.entity';

@Injectable()
export class FiltersService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  async getFilters() {
    const [countries, religions, castes, motherTongues, cities, maritalStatuses] =
      await Promise.all([
        this.getDistinctValues('country'),
        this.getDistinctValues('religion'),
        this.getCasteList(),
        this.getDistinctValues('motherTongue'),
        this.getCityList(),
        this.getDistinctValues('maritalStatus'),
      ]);

    return {
      country: countries,
      religion: religions,
      maritalStatus: maritalStatuses,
      motherTongueList: motherTongues,
      casteList: castes,
      cityList: cities,
    };
  }

  private async getDistinctValues(column: string): Promise<string[]> {
    const results = await this.profilesRepository
      .createQueryBuilder('profile')
      .select(`DISTINCT profile.${column}`, 'value')
      .where(`profile.${column} IS NOT NULL`)
      .orderBy('value', 'ASC')
      .getRawMany();

    return results.map((r) => r.value);
  }

  private async getCasteList() {
    const results = await this.profilesRepository
      .createQueryBuilder('profile')
      .select('profile.caste', 'caste')
      .addSelect('profile.religion', 'religion')
      .where('profile.caste IS NOT NULL')
      .groupBy('profile.caste')
      .addGroupBy('profile.religion')
      .orderBy('profile.caste', 'ASC')
      .getRawMany();

    return results;
  }

  private async getCityList() {
    const results = await this.profilesRepository
      .createQueryBuilder('profile')
      .select('profile.city', 'city')
      .addSelect('profile.country', 'country')
      .where('profile.city IS NOT NULL')
      .groupBy('profile.city')
      .addGroupBy('profile.country')
      .orderBy('profile.city', 'ASC')
      .getRawMany();

    return results;
  }
}
