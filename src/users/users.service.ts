import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import statuses from 'src/constants/statuses';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { auth_info } = createUserDto;
    const hashedPassword = bcrypt.hashSync(auth_info.password, 10);

    createUserDto.auth_info.password = hashedPassword;

    const user = await this.userModel.create(createUserDto);

    return user;
  }

  async createUsers(createUserDtoS: CreateUserDto[]) {
    const users = await this.userModel.insertMany(createUserDtoS);
    return users;
  }

  async getUsers() {
    const users = await this.userModel.find().select('-auth_info').exec();
    return users;
  }

  async getUser(id: string) {
    const user = await this.userModel.findById(id).select('-auth_info').exec();
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.auth_info && updateUserDto.auth_info.password) {
      const hashedPassword = bcrypt.hashSync(
        updateUserDto.auth_info.password,
        10,
      );
      updateUserDto.auth_info.password = hashedPassword;
    }
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto)
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async deleteUser(id: string) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { status: statuses.inactive })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userModel
      .findOne({ 'contact_info.email': email })
      .exec();
    return user;
  }
}
