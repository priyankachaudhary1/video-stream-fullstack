import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { VideoCategoryService } from './video-category.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoleEnum } from 'src/common/enum/user-role.enum';
import { CreateVideoCategoryDto } from './dtos/create-category.dto';

@Controller('video-category')
export class VideoCategoryController {
  constructor(private readonly videoCategoryService: VideoCategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async createVideoCategory(@Body() body: CreateVideoCategoryDto) {
    return await this.videoCategoryService.createVideoCategory(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllVideoCategory() {
    return await this.videoCategoryService.findAllVideoCategories();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async updateCategory(
    @Param('id') id: string,
    @Body() body: CreateVideoCategoryDto,
  ) {
    return await this.videoCategoryService.updateVideoCategory(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async deleteVideoCategory(@Param('id') id: string) {
    return await this.videoCategoryService.deleteVideoCategory(id);
  }
}
