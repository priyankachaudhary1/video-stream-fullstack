import { Body, Controller, Get, Post } from '@nestjs/common';
import { GameScheduleService } from './game-schedule.service';
import { AddGameScheduleDto } from './dtos';

@Controller('game-schedule')
export class GameScheduleController {
  constructor(private readonly gameScheduleService: GameScheduleService) {}

  @Post()
  public async createGameSchedule(@Body() body: AddGameScheduleDto) {
    return this.gameScheduleService.addGameSchedule(body);
  }

  @Get()
  public async getAllGameSchedule() {
    return this.gameScheduleService.getAllGameSchedule();
  }
}
