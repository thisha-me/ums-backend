import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import gender from 'src/constants/gender';
import statuses from 'src/constants/statuses';
import userTypes from 'src/constants/user_types';

@Schema({ _id: false })
class BasicInfo {
  @Prop({
    required: true,
    trim: true,
  })
  first_name: string;

  @Prop({
    required: true,
    trim: true,
  })
  last_name: string;

  @Prop({
    required: true,
    trim: true,
  })
  dob: Date;

  @Prop({
    required: true,
    trim: true,
    enum: gender,
  })
  gender: string;
}

@Schema({ _id: false })
class ContactInfo {
  @Prop({
    required: true,
    trim: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
    trim: true,
    validate: {
      validator: (v: string[]) => v.length <= 3,
      message: 'Mobile numbers should not exceed 3',
    },
  })
  mobile_numbers: string[];
}

@Schema({ _id: false })
class AuthInfo {
  @Prop({
    required: true,
    type: String,
    trim: true,
  })
  password: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    trim: true,
    enum: userTypes,
  })
  type: string;

  @Prop({
    required: true,
    default: 'ONBOARD',
    trim: true,
    enum: statuses,
  })
  status: string;

  @Prop({
    required: true,
  })
  basic_info: BasicInfo;

  @Prop({
    required: true,
  })
  contact_info: ContactInfo;

  @Prop({
    required: true,
  })
  auth_info: AuthInfo;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
