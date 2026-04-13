import {
  IsString,
  IsOptional,
  IsDateString,
  IsObject,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class FamilyDto {
  @IsOptional() @IsString() culturalValues?: string;
  @IsOptional() @IsString() about?: string;
  @IsOptional() @IsString() fatherProfession?: string;
  @IsOptional() @IsString() motherProfession?: string;
  @IsOptional() @IsString() brothers?: string;
  @IsOptional() @IsString() brothersMarried?: string;
  @IsOptional() @IsString() sisters?: string;
  @IsOptional() @IsString() sistersMarried?: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsString() located?: string;
  @IsOptional() @IsString() familyIncome?: string;
}

class InterestsDto {
  @IsOptional() @IsArray() hobbies?: string[];
  @IsOptional() @IsArray() interests?: string[];
  @IsOptional() @IsArray() cuisine?: string[];
  @IsOptional() @IsArray() music?: string[];
  @IsOptional() @IsArray() movies?: string[];
  @IsOptional() @IsArray() sports?: string[];
  @IsOptional() @IsArray() canSpeak?: string[];
}

class PhotoDto {
  @IsString() url: string;
  @IsOptional() @IsString() thumbnailUrl?: string;
  @IsOptional() order?: number;
  @IsOptional() isProfilePhoto?: boolean;
}

export class CreateProfileDto {
  // Basic
  @IsString() displayName: string;
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsString() gender: string;
  @IsOptional() @IsString() age?: string;
  @IsString() maritalStatus: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;
  @IsOptional() @IsString() phoneNumber?: string;

  // Doctrine
  @IsString() religion: string;
  @IsString() caste: string;
  @IsOptional() @IsString() subCaste?: string;
  @IsString() motherTongue: string;
  @IsOptional() @IsString() gotra?: string;
  @IsOptional() @IsString() religiousValues?: string;
  @IsOptional() @IsString() casteNoBar?: string;

  // Location
  @IsString() country: string;
  @IsString() state: string;
  @IsOptional() @IsString() district?: string;
  @IsString() city: string;
  @IsOptional() @IsString() residencyStatus?: string;
  @IsOptional() @IsString() zipCode?: string;

  // Education
  @IsOptional() @IsString() education?: string;
  @IsOptional() @IsString() educationStream?: string;
  @IsOptional() @IsString() college?: string;

  // Profession
  @IsOptional() @IsString() occupation?: string;
  @IsOptional() @IsString() industry?: string;
  @IsOptional() @IsString() workingWith?: string;
  @IsOptional() @IsString() income?: string;
  @IsOptional() @IsString() employer?: string;

  // Trait
  @IsOptional() @IsString() aboutMe?: string;
  @IsOptional() @IsString() personalValues?: string;

  // Appearance
  @IsOptional() @IsString() height?: string;
  @IsOptional() @IsString() weight?: string;
  @IsOptional() @IsString() complexion?: string;
  @IsOptional() @IsString() bodyType?: string;

  // Lifestyle
  @IsOptional() @IsString() diet?: string;
  @IsOptional() @IsString() drink?: string;
  @IsOptional() @IsString() smoke?: string;

  // Health
  @IsOptional() @IsString() bloodGroup?: string;
  @IsOptional() @IsString() specialCases?: string;

  // Family (nested JSON)
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => FamilyDto)
  family?: FamilyDto;

  // Origin
  @IsOptional() @IsString() nativePlace?: string;
  @IsOptional() @IsArray() grewUpIn?: string[];

  // Interests (nested JSON)
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => InterestsDto)
  interests?: InterestsDto;

  // Photos
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhotoDto)
  photos?: PhotoDto[];
}
