import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(await bcrypt.compareSync(password, user.auth_info.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    console.log(user.type);
    const token = this.jwtService.sign(
      {
        id: user._id,
        email: user.contact_info.email,
        type: user.type,
      },
      { secret: jwtSecret },
    );

    const userObj = user.toObject();
    delete userObj.auth_info;

    return { token: token, user: userObj };
  }
}
