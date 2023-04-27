import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto, UpdateUserProfileDto } from './dtos';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: SignUpDto) {
    return await this.userService.createUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateUserProfile(@Body() body: UpdateUserProfileDto, @Req() req) {
    const { id } = req.user;
    return await this.userService.updateUserProfile(id, body);
  }
}
