import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Photo } from './photo.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  // --- Account ---
  @Column({ default: 'Pending' })
  status: string;

  @Column({ nullable: true })
  postedBy: string;

  @Column('text', { array: true, default: '{"Free Member"}' })
  membership: string[];

  @Column({ default: false })
  isScreened: boolean;

  @Column({ default: false })
  isHidden: boolean;

  @Column({ nullable: true })
  memberLogin: string;

  // --- Basic ---
  @Column()
  displayName: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  gender: string;

  @Column({ nullable: true })
  age: string;

  @Column()
  maritalStatus: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  photoUrl: string;

  // --- Doctrine (Religion/Caste) ---
  @Column()
  religion: string;

  @Column()
  caste: string;

  @Column({ nullable: true })
  subCaste: string;

  @Column()
  motherTongue: string;

  @Column({ nullable: true })
  gotra: string;

  @Column({ nullable: true })
  religiousValues: string;

  @Column({ nullable: true })
  casteNoBar: string;

  // --- Location ---
  @Column()
  country: string;

  @Column()
  state: string;

  @Column({ nullable: true })
  district: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  residencyStatus: string;

  @Column({ nullable: true })
  zipCode: string;

  // --- Education ---
  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true })
  educationStream: string;

  @Column({ nullable: true })
  college: string;

  // --- Profession ---
  @Column({ nullable: true })
  occupation: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  workingWith: string;

  @Column({ nullable: true })
  income: string;

  @Column({ nullable: true })
  employer: string;

  // --- Trait ---
  @Column({ type: 'text', nullable: true })
  aboutMe: string;

  @Column({ nullable: true })
  personalValues: string;

  // --- Appearance ---
  @Column({ nullable: true })
  height: string;

  @Column({ nullable: true })
  weight: string;

  @Column({ nullable: true })
  complexion: string;

  @Column({ nullable: true })
  bodyType: string;

  // --- Lifestyle ---
  @Column({ nullable: true })
  diet: string;

  @Column({ nullable: true })
  drink: string;

  @Column({ nullable: true })
  smoke: string;

  // --- Health ---
  @Column({ nullable: true })
  bloodGroup: string;

  @Column({ nullable: true })
  specialCases: string;

  // --- Family (JSONB — complex nested data, less frequently queried) ---
  @Column({ type: 'jsonb', nullable: true })
  family: {
    culturalValues?: string;
    about?: string;
    fatherProfession?: string;
    motherProfession?: string;
    brothers?: string;
    brothersMarried?: string;
    sisters?: string;
    sistersMarried?: string;
    type?: string;
    located?: string;
    familyIncome?: string;
  };

  // --- Origin ---
  @Column({ nullable: true })
  nativePlace: string;

  @Column('text', { array: true, nullable: true })
  grewUpIn: string[];

  // --- Interests (JSONB — arrays of tags) ---
  @Column({ type: 'jsonb', nullable: true })
  interests: {
    hobbies?: string[];
    interests?: string[];
    cuisine?: string[];
    music?: string[];
    movies?: string[];
    sports?: string[];
    canSpeak?: string[];
  };

  // --- Photos ---
  @OneToMany(() => Photo, (photo) => photo.profile, {
    cascade: true,
    eager: true,
  })
  photos: Photo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
