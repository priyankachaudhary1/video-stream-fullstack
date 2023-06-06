import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ISuccessMessage } from 'src/common/responses';
import { ComplaintsEntity } from 'src/entities/complaints.entity';
import { Repository } from 'typeorm';
import { CreateComplaintsDto } from './dtos';
import { IComplaintsresponse } from './responses';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(ComplaintsEntity)
    private readonly complaintsrepository: Repository<ComplaintsEntity>,
  ) {}

  public async createComplaints(
    userId: string,
    body: CreateComplaintsDto,
  ): Promise<ISuccessMessage> {
    const { title, complaint, videoId } = body;

    await this.complaintsrepository.save({
      title,
      complaint,
      user: { id: userId },
      video: { id: videoId },
    });

    return {
      message: 'Complaints send successfully.',
    };
  }

  public async findAllComplaints(): Promise<IComplaintsresponse[]> {
    const allFeedback = await this.complaintsrepository.find({
      relations: { user: true },
    });

    return allFeedback.map((complaints) =>
      this.transformToFeedbackresponse(complaints),
    );
  }

  public async deleteComplaints(id: string): Promise<ISuccessMessage> {
    await this.complaintsrepository.delete(id);

    return {
      message: 'Complaints deleted successfully.',
    };
  }

  private transformToFeedbackresponse(
    complaints: ComplaintsEntity,
  ): IComplaintsresponse {
    const { id, complaint, title, user } = complaints;

    const { name } = user;

    return { id, complaint, title, name };
  }
}
