import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoEntity } from 'src/entities/video.entity';
import { UploadVideoDto } from './dtos';
import { CloudinaryService } from '../cloudinary/services/cloudinary.service';
import { ISuccessMessage } from 'src/common/responses';
import { IVideoResponse } from './responses';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async uploadVideo(
    body: UploadVideoDto,
    video: Express.Multer.File,
  ): Promise<ISuccessMessage> {
    const { title, description, categoryId } = body;
    const { secure_url } = await this.cloudinaryService.uploadImage(
      video,
      'video-stream',
    );

    await this.videoRepository.save({
      title,
      description,
      videoCategory: { id: categoryId },
      videoUrl: secure_url,
    });
    return { message: 'Video uploaded successfully.' };
  }

  public async getAllVideos(): Promise<IVideoResponse[]> {
    const allVideos = await this.videoRepository.find({
      relations: { videoCategory: true },
    });

    return allVideos.map((video) => this.transformToVideoResponse(video));
  }

  private transformToVideoResponse(video: VideoEntity): IVideoResponse {
    const { id, title, description, videoUrl, videoCategory, createdAt } =
      video;

    delete videoCategory?.createdAt;
    delete videoCategory?.updatedAt;

    return { id, title, description, videoUrl, videoCategory, createdAt };
  }
}
