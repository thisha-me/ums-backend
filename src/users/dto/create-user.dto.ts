import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsAdminPasswordRequired } from '../decorators/is-admin-password-required.decorator';

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
  @IsEnum(['MALE', 'FEMALE', 'OTHER'])
  gender: string;
}

class ContactInfo {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  phone: string;
}

class AuthInfo {
  @Transform(({ value }) => value.trim())
  @IsAdminPasswordRequired()
  password: string;
}
export class CreateUserDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsEnum(['ADMIN', 'USER'])
  type: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsEnum(['ACTIVE', 'ONBOARD'])
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
