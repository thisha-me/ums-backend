import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
  UseGuards,
  Put,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/auth/roles.decorator';
import userTypes from 'src/constants/user_types';
import { RoleGuard } from 'src/auth/role.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Roles(userTypes.admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const result = await this.usersService.createUser(createUserDto);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // @Roles(userTypes.admin, userTypes.user)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  async getUsers() {
    try {
      const users = await this.usersService.getUsers();
      return users;
    } catch (error) {
      return error;
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.usersService.getUser(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  @Roles(userTypes.admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.usersService.updateUser(id, updateUserDto);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  @Roles(userTypes.admin, userTypes.user)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      const user = await this.usersService.deleteUser(id);
      return user;
    } catch (error) {
      return error;
    }
  }

  @Roles(userTypes.admin, userTypes.user)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('page/:page')
  async getUserByPage(@Param('page') page: number) {
    try {
      const users = await this.usersService.getUserByPage(page);
      return users;
    } catch (error) {
      return error;
    }
  }
}
