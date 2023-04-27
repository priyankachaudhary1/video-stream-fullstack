import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { LoginDto } from './dtos/login.dto';
import { IAuthResponse } from './responses';
import { UserService } from '../user/user.service';
import { UserEntity } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser({
    email,
    password,
  }: LoginDto): Promise<UserEntity | null> {
    const user = await this.userService.findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;

      return user;
    }

    return null;
  }

  async login(user: UserEntity): Promise<IAuthResponse> {
    const { id, role } = user;

    const payload = { id, role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      accessToken,
      role,
    };
  }
}
