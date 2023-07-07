import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameScheduleEntity } from 'src/entities/game-schedule.entity';
import { Repository } from 'typeorm';
import { AddGameScheduleDto } from './dtos';
import { ISuccessMessage } from 'src/common/responses';
import { VideoCategoryEntity } from 'src/entities/video-category.entity';

@Injectable()
export class GameScheduleService {
  constructor(
    @InjectRepository(GameScheduleEntity)
    private readonly gameScheduleRepository: Repository<GameScheduleEntity>,
  ) {}

  public async addGameSchedule(
    body: AddGameScheduleDto,
  ): Promise<ISuccessMessage> {
    const { categoryId, scheduleDate } = body;

    await this.gameScheduleRepository.save({
      scheduleDate: scheduleDate,
      category: { id: categoryId } as VideoCategoryEntity,
    });

    return { message: 'Game scheduled successfully' };
  }

  public async getAllGameSchedule() {
    const allGameSchedule = await this.gameScheduleRepository.find({
      relations: {
        category: true,
      },
    });

    const result = allGameSchedule.reduce((acc, obj) => {
      const categoryObj = acc.find(
        (item) => item.category === obj.category.name,
      );

      if (categoryObj) {
        categoryObj.schedules.push({
          id: obj.id,
          scheduleDate: obj.scheduleDate,
          category: {
            id: obj.category.id,
            name: obj.category.name,
          },
        });
      } else {
        acc.push({
          category: obj.category.name,
          schedules: [
            {
              id: obj.id,
              scheduleDate: obj.scheduleDate,
              category: {
                id: obj.category.id,
                name: obj.category.name,
              },
            },
          ],
        });
      }

      return acc;
    }, []);

    return result;
  }
}
