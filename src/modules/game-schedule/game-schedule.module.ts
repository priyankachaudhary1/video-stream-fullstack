import { Module } from '@nestjs/common';
import { GameScheduleController } from './game-schedule.controller';
import { GameScheduleService } from './game-schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameScheduleEntity } from 'src/entities/game-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameScheduleEntity])],
  controllers: [GameScheduleController],
  providers: [GameScheduleService],
})
export class GameScheduleModule {}
