import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto, UpdateUserProfileDto } from './dtos';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoleEnum } from 'src/common/enum/user-role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: SignUpDto) {
    return await this.userService.createUser(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async findAllUsers() {
    return await this.userService.findAllUsers();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async suspendOrReactiveUser(@Param('id') id: string) {
    return await this.userService.suspendOrReactiveUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateUserProfile(@Body() body: UpdateUserProfileDto, @Req() req) {
    const { id } = req.user;
    return await this.userService.updateUserProfile(id, body);
  }
}
