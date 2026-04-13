import { IsEnum } from 'class-validator';
import { ConnectionStatus } from '../entities/connection.entity';

export class UpdateConnectionDto {
  @IsEnum(ConnectionStatus)
  status: ConnectionStatus;
}
