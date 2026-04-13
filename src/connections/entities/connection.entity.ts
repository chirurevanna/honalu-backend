import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';

export enum ConnectionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  BLOCKED = 'blocked',
}

@Entity('connections')
@Unique(['fromProfileId', 'toProfileId'])
export class Connection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fromProfileId' })
  fromProfile: Profile;

  @Column()
  fromProfileId: number;

  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'toProfileId' })
  toProfile: Profile;

  @Column()
  toProfileId: number;

  @Column({ type: 'enum', enum: ConnectionStatus, default: ConnectionStatus.PENDING })
  status: ConnectionStatus;

  @Column({ nullable: true })
  message: string;

  @Column({ default: false })
  viewedByRecipient: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
