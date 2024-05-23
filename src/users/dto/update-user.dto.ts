import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import userTypes from 'src/constants/user_types';
import statuses from 'src/constants/statuses';
import gender from 'src/constants/gender';

class BasicInfo {
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  first_name: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  last_name: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  dob: Date;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsEnum(gender)
  gender: string;
}

class ContactInfo {
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @IsString({ each: true })
  @Transform(({ value }) => value.map((v: string) => v.trim()))
  mobile_numbers: string[];
}

class AuthInfo {
  @Transform(({ value }) => value.trim())
  @IsString()
  password: string;
}
export class UpdateUserDto {
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsEnum(userTypes)
  type: string;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsEnum(statuses)
  status: string;

  @ValidateNested()
  @Type(() => BasicInfo)
  basic_info: BasicInfo;

  @ValidateNested()
  @Type(() => ContactInfo)
  contact_info: ContactInfo;

  @ValidateNested()
  @Type(() => AuthInfo)
  auth_info: AuthInfo;
}
