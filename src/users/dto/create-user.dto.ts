import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
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
  @IsNotEmpty()
  first_name: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  dob: Date;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsEnum(gender)
  gender: string;
}

class ContactInfo {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
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
export class CreateUserDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsEnum(userTypes)
  type: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
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
