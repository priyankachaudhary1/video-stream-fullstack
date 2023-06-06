import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRoleEnum } from 'src/common/enum/user-role.enum';
import { CreateFeedbackDto } from './dtos';

@Controller('feedback')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @Roles(UserRoleEnum.USER)
  public async addFeedback(@Body() body: CreateFeedbackDto, @Req() req) {
    const userId = req.user.id;
    return await this.feedbackService.createFeedback(userId, body);
  }

  @Get()
  public async findAllFeedbacks() {
    return await this.feedbackService.findAllFeedback();
  }

  @Patch(':id')
  @Roles(UserRoleEnum.USER)
  public async updateFeedback(
    @Param('id') id: string,
    @Body() body: CreateFeedbackDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return await this.feedbackService.updateFeedback(id, userId, body);
  }

  @Delete('admin/:id')
  @Roles(UserRoleEnum.ADMIN)
  public async deleteFeedbackByAdmin(@Param('id') id: string) {
    return await this.feedbackService.deleteFeedbackByAdmin(id);
  }

  @Delete('user/:id')
  @Roles(UserRoleEnum.USER)
  public async deleteFeedbackByUser(@Param('id') id: string, @Req() req) {
    const userId = req.useri.id;
    return await this.feedbackService.deleteFeedbackByUser(id, userId);
  }
}
