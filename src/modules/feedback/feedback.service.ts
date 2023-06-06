import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedBackEntity } from 'src/entities/feedback.entity';
import { Repository } from 'typeorm';
import { CreateFeedbackDto } from './dtos';
import { ISuccessMessage } from 'src/common/responses';
import { IFeedbackresponse } from './responses';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedBackEntity)
    private readonly feedbackrepository: Repository<FeedBackEntity>,
  ) {}

  public async createFeedback(
    userId: string,
    body: CreateFeedbackDto,
  ): Promise<ISuccessMessage> {
    const { title, feedBack, videoId } = body;

    await this.feedbackrepository.save({
      title,
      feedBack,
      user: { id: userId },
      video: { id: videoId },
    });

    return {
      message: 'Feedback added successfully.',
    };
  }

  public async findAllFeedback(): Promise<IFeedbackresponse[]> {
    const allFeedback = await this.feedbackrepository.find({
      relations: { user: true },
    });

    return allFeedback.map((feedback) =>
      this.transformToFeedbackresponse(feedback),
    );
  }

  public async updateFeedback(
    id: string,
    userId: string,
    body: CreateFeedbackDto,
  ): Promise<ISuccessMessage> {
    const { title, feedBack } = body;

    await this.feedbackrepository.update(
      { id, user: { id: userId } },
      {
        title,
        feedBack,
      },
    );

    return {
      message: 'Feedback updated successfully.',
    };
  }

  public async deleteFeedbackByAdmin(id: string): Promise<ISuccessMessage> {
    await this.feedbackrepository.delete(id);

    return {
      message: 'Feedback deleted successfully.',
    };
  }

  public async deleteFeedbackByUser(
    id: string,
    userId: string,
  ): Promise<ISuccessMessage> {
    await this.feedbackrepository.delete({ id, user: { id: userId } });

    return {
      message: 'Feedback deleted successfully.',
    };
  }

  private transformToFeedbackresponse(
    feedback: FeedBackEntity,
  ): IFeedbackresponse {
    const { id, feedBack, title, user } = feedback;

    const { name } = user;

    return { id, feedBack, title, name };
  }
}
