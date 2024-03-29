import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResendOtpDto,
  SignUpDto,
  UpdateAccountStatusDto,
  UpdateUserProfileDto,
} from './dtos';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoleEnum } from 'src/common/enum/user-role.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: SignUpDto) {
    return await this.userService.createUser(body);
  }

  @Patch('resendOtp')
  async resendOtp(@Body() body: ResendOtpDto) {
    return await this.userService.resendOtp(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async findAllUsers() {
    return await this.userService.findAllUsers();
  }

  @Get('total-users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async findTotalUsers() {
    return await this.userService.findTotalUsers();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req) {
    const userId = req.user.id;
    return await this.userService.me(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @UseInterceptors(FileInterceptor('profile'))
  async updateUserProfile(
    @Body() body: UpdateUserProfileDto,
    @Req() req,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '(.jpg|.png|.jpeg)$',
        })
        .build(),
    )
    profile: Express.Multer.File,
  ) {
    const { id } = req.user;
    return await this.userService.updateUserProfile(id, body, profile);
  }

  @Patch('verify-otp')
  async verifyOtp(@Body() body: UpdateAccountStatusDto) {
    return await this.userService.verifyOtp(body);
  }

  @Patch('password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.USER)
  async changePassword(@Body() body: ChangePasswordDto, @Req() req) {
    const userId = req.user.id;
    return await this.userService.changePassword(userId, body);
  }

  @Patch('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return await this.userService.forgotPassword(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async suspendOrReactiveUser(@Param('id') id: string) {
    return await this.userService.suspendOrReactiveUser(id);
  }
}
