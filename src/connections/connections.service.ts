import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connection, ConnectionStatus } from './entities/connection.entity';
import { ProfilesService } from '../profiles/profiles.service';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(Connection)
    private connectionsRepository: Repository<Connection>,
    private profilesService: ProfilesService,
  ) {}

  async sendRequest(userId: string, dto: CreateConnectionDto) {
    const fromProfile = await this.profilesService.findByUserId(userId);

    if (fromProfile.id === dto.toProfileId) {
      throw new ConflictException('Cannot send request to yourself');
    }

    await this.profilesService.findOne(dto.toProfileId);

    const existing = await this.connectionsRepository.findOne({
      where: { fromProfileId: fromProfile.id, toProfileId: dto.toProfileId },
    });

    if (existing) {
      throw new ConflictException('Connection request already exists');
    }

    const connection = this.connectionsRepository.create({
      fromProfileId: fromProfile.id,
      toProfileId: dto.toProfileId,
      message: dto.message,
      status: ConnectionStatus.PENDING,
    });

    return this.connectionsRepository.save(connection);
  }

  async getReceived(userId: string) {
    const profile = await this.profilesService.findByUserId(userId);

    return this.connectionsRepository.find({
      where: { toProfileId: profile.id },
      relations: ['fromProfile', 'fromProfile.photos'],
      order: { createdAt: 'DESC' },
    });
  }

  async getSent(userId: string) {
    const profile = await this.profilesService.findByUserId(userId);

    return this.connectionsRepository.find({
      where: { fromProfileId: profile.id },
      relations: ['toProfile', 'toProfile.photos'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(
    id: number,
    userId: string,
    dto: UpdateConnectionDto,
  ) {
    const connection = await this.connectionsRepository.findOne({
      where: { id },
      relations: ['toProfile'],
    });

    if (!connection) {
      throw new NotFoundException(`Connection #${id} not found`);
    }

    const profile = await this.profilesService.findByUserId(userId);

    const isRecipient = connection.toProfileId === profile.id;
    const isSender = connection.fromProfileId === profile.id;

    if (dto.status === ConnectionStatus.ACCEPTED && !isRecipient) {
      throw new ForbiddenException('Only the recipient can accept a request');
    }

    if (dto.status === ConnectionStatus.REJECTED && !isRecipient) {
      throw new ForbiddenException('Only the recipient can reject a request');
    }

    if (dto.status === ConnectionStatus.CANCELLED && !isSender) {
      throw new ForbiddenException('Only the sender can cancel a request');
    }

    connection.status = dto.status;
    return this.connectionsRepository.save(connection);
  }
}
