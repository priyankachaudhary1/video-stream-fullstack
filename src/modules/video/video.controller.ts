import {
  Body,
  Controller,
  Post,
  UploadedFile,
  ParseFilePipeBuilder,
  UseInterceptors,
  Get,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from './video.service';
import { UploadVideoDto } from './dtos';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoleEnum } from 'src/common/enum/user-role.enum';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @UseInterceptors(
    FileInterceptor('video', {
      limits: { fileSize: 1000 * 1024 * 1024 * 1000 * 1000 },
    }),
  )
  async uploadVideo(
    @Body() body: UploadVideoDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '(.mp4|.mov|.mkv|.flv|.wmv|webm)$',
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1000 * 1000 * 1000,
        })
        .build(),
    )
    video: Express.Multer.File,
  ) {
    return await this.videoService.uploadVideo(body, video);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllVideo() {
    return await this.videoService.findAllVideo();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findVideoById(@Param('id') id: string) {
    return await this.videoService.findVideoById(id);
  }

  @Get('category/:categoryId')
  @UseGuards(JwtAuthGuard)
  async findVideoByCategory(@Param('categoryId') categoryId: string) {
    return await this.videoService.findVideoByCategory(categoryId);
  }

  @Get('total-videos')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoleEnum.ADMIN)
  async findTotalVideoCount() {
    return await this.videoService.findTotalVideosCount();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async updateVideoContent(
    @Param('id') id: string,
    @Body() body: UploadVideoDto,
  ) {
    return await this.videoService.updateVideoContent(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async deleteVideo(@Param('id') id: string) {
    return await this.videoService.deleteVideo(id);
  }
}
