import { Injectable } from '@nestjs/common';
import { ISuccessMessage } from 'src/common/responses';
import { VideoCategoryEntity } from 'src/entities/video-category.entity';
import { Repository } from 'typeorm';
import { CreateVideoCategoryDto } from './dtos/create-category.dto';
import { IVideoCategoryReponse } from './responses';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VideoCategoryService {
  constructor(
    @InjectRepository(VideoCategoryEntity)
    private readonly videoCategoryRepository: Repository<VideoCategoryEntity>,
  ) {}

  public async createVideoCategory(
    body: CreateVideoCategoryDto,
  ): Promise<ISuccessMessage> {
    const { name } = body;

    await this.videoCategoryRepository.save({ name });
    return { message: 'Category created successfully.' };
  }

  public async findAllVideoCategories(): Promise<IVideoCategoryReponse[]> {
    const videoCategories = await this.videoCategoryRepository.find();
    return videoCategories.map((category) =>
      this.transformToVideoCategoryResponse(category),
    );
  }

  public async updateVideoCategory(
    id: string,
    body: CreateVideoCategoryDto,
  ): Promise<ISuccessMessage> {
    const { name } = body;

    await this.videoCategoryRepository.update({ id }, { name });
    return { message: 'Category updated successfully.' };
  }

  public async deleteVideoCategory(id: string): Promise<ISuccessMessage> {
    await this.videoCategoryRepository.delete({ id });
    return { message: 'Category deleted successfully.' };
  }

  private transformToVideoCategoryResponse(
    category: VideoCategoryEntity,
  ): IVideoCategoryReponse {
    const { id, name } = category;
    return {
      id,
      name,
    };
  }
}
