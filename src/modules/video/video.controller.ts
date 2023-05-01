import {
  Body,
  Controller,
  Post,
  UploadedFile,
  ParseFilePipeBuilder,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from './video.service';
import { UploadVideoDto } from './dtos';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  //   /\.(mp4|mov|avi|mkv|flv|wmv|webm)$/i
  @Post()
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
  async getAllVideos() {
    return await this.videoService.getAllVideos();
  }
}
