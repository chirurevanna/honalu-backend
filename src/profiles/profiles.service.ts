import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { Photo } from './entities/photo.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import type { UpdateProfileDto } from './dto/update-profile.dto';
import { SearchProfilesDto } from './dto/search-profiles.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
  ) {}

  async create(userId: string, dto: CreateProfileDto): Promise<Profile> {
    const { photos, ...profileData } = dto;

    const profile = this.profilesRepository.create({
      ...profileData,
      userId,
      status: 'Active',
    });

    const savedProfile = await this.profilesRepository.save(profile);

    if (photos?.length) {
      const photoEntities = photos.map((p) =>
        this.photosRepository.create({
          ...p,
          profileId: savedProfile.id,
          status: 'approved',
        }),
      );
      await this.photosRepository.save(photoEntities);
    }

    return this.findOne(savedProfile.id);
  }

  async findAll(query: SearchProfilesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb: SelectQueryBuilder<Profile> = this.profilesRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.photos', 'photo')
      .where('profile.isHidden = :hidden', { hidden: false });

    if (query.gender) {
      qb.andWhere('profile.gender = :gender', { gender: query.gender });
    }
    if (query.maritalStatus) {
      qb.andWhere('profile.maritalStatus = :maritalStatus', {
        maritalStatus: query.maritalStatus,
      });
    }
    if (query.religion) {
      qb.andWhere('profile.religion = :religion', {
        religion: query.religion,
      });
    }
    if (query.caste) {
      qb.andWhere('profile.caste = :caste', { caste: query.caste });
    }
    if (query.motherTongue) {
      qb.andWhere('profile.motherTongue = :motherTongue', {
        motherTongue: query.motherTongue,
      });
    }
    if (query.country) {
      qb.andWhere('profile.country = :country', { country: query.country });
    }
    if (query.city) {
      qb.andWhere('profile.city = :city', { city: query.city });
    }
    if (query.education) {
      qb.andWhere('profile.education ILIKE :education', {
        education: `%${query.education}%`,
      });
    }
    if (query.ageMin) {
      qb.andWhere('CAST(profile.age AS INTEGER) >= :ageMin', {
        ageMin: parseInt(query.ageMin, 10),
      });
    }
    if (query.ageMax) {
      qb.andWhere('CAST(profile.age AS INTEGER) <= :ageMax', {
        ageMax: parseInt(query.ageMax, 10),
      });
    }

    qb.orderBy('profile.createdAt', 'DESC').skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Profile> {
    const profile = await this.profilesRepository.findOne({
      where: { id },
      relations: ['photos'],
    });

    if (!profile) {
      throw new NotFoundException(`Profile #${id} not found`);
    }

    return profile;
  }

  async findByUserId(userId: string): Promise<Profile> {
    const profile = await this.profilesRepository.findOne({
      where: { userId },
      relations: ['photos'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found for this user');
    }

    return profile;
  }

  async update(
    id: number,
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.findOne(id);

    if (profile.userId !== userId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const { photos, ...updateData } = dto as CreateProfileDto;

    Object.assign(profile, updateData);
    await this.profilesRepository.save(profile);

    if (photos) {
      await this.photosRepository.delete({ profileId: id });
      const photoEntities = photos.map((p: { url: string; thumbnailUrl?: string; order?: number; isProfilePhoto?: boolean }) =>
        this.photosRepository.create({
          ...p,
          profileId: id,
          status: 'approved',
        }),
      );
      await this.photosRepository.save(photoEntities);
    }

    return this.findOne(id);
  }

  async remove(id: number, userId: string): Promise<void> {
    const profile = await this.findOne(id);

    if (profile.userId !== userId) {
      throw new ForbiddenException('You can only delete your own profile');
    }

    await this.profilesRepository.remove(profile);
  }
}
