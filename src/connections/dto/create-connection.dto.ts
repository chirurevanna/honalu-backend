import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateConnectionDto {
  @IsInt()
  toProfileId: number;

  @IsOptional()
  @IsString()
  message?: string;
}
