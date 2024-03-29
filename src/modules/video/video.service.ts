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
    const { secure_url } = await this.cloudinaryService.uploadVideo(
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

  public async findAllVideo() {
    const allVideos = await this.videoRepository.find({
      relations: { videoCategory: true },
      order: { createdAt: 'DESC' },
    });

    const result = allVideos.reduce((acc, obj) => {
      const categoryObj = acc.find(
        (item) => item.category === obj.videoCategory.name,
      );
      if (categoryObj) {
        categoryObj.videos.push({
          id: obj.id,
          title: obj.title,
          description: obj.description,
          videoUrl: obj.videoUrl,
          categoryId: {
            id: obj.videoCategory.id,
            name: obj.videoCategory.name,
          },
        });
      } else {
        acc.push({
          category: obj.videoCategory.name,
          videos: [
            {
              id: obj.id,
              videoUrl: obj.videoUrl,
              title: obj.title,
              description: obj.description,
              categoryId: {
                id: obj.videoCategory.id,
                name: obj.videoCategory.name,
              },
            },
          ],
        });
      }
      return acc;
    }, []);

    return result;
    // return allVideos.map((video) => this.transformToVideoResponse(video));
  }

  public async findVideoByCategory(
    categoryId: string,
  ): Promise<IVideoResponse[]> {
    const allVideos = await this.videoRepository.find({
      where: {
        videoCategory: {
          id: categoryId,
        },
      },
      relations: { videoCategory: true },
      order: { createdAt: 'DESC' },
    });

    return allVideos.map((video) => this.transformToVideoResponse(video));
  }

  public async findTotalVideosCount(): Promise<number> {
    return await this.videoRepository.count();
  }

  public async findVideoById(id: string): Promise<IVideoResponse> {
    const video = await this.videoRepository.findOne({
      where: { id },
      relations: { videoCategory: true },
    });

    return this.transformToVideoResponse(video);
  }

  public async updateVideoContent(
    id: string,
    body: UploadVideoDto,
  ): Promise<ISuccessMessage> {
    const { title, description, categoryId } = body;

    await this.videoRepository.update(
      { id },
      {
        title,
        description,
        videoCategory: { id: categoryId },
      },
    );
    return { message: 'Video content updated successfully.' };
  }

  public async deleteVideo(id: string): Promise<ISuccessMessage> {
    const video = await this.videoRepository.findOne({ where: { id } });

    const cloudinaryVideoId = this.cloudinaryService.getPublicId(
      video.videoUrl,
    );

    await Promise.all([
      await this.cloudinaryService.deleteVideo(
        'video-stream',
        cloudinaryVideoId,
      ),
      await this.videoRepository.delete(id),
    ]);

    return { message: 'Video deleted successfully.' };
  }

  private transformToVideoResponse(video: VideoEntity): IVideoResponse {
    const { id, title, description, videoUrl, videoCategory, createdAt } =
      video;

    delete videoCategory?.createdAt;
    delete videoCategory?.updatedAt;

    return { id, title, description, videoUrl, videoCategory, createdAt };
  }
}
