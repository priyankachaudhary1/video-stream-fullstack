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
import { ComplaintsService } from './complaints.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoleEnum } from 'src/common/enum/user-role.enum';
import { CreateComplaintsDto } from './dtos';

@Controller('complaints')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @Roles(UserRoleEnum.USER)
  public async addComplaints(@Body() body: CreateComplaintsDto, @Req() req) {
    const userId = req.user.id;
    return await this.complaintsService.createComplaints(userId, body);
  }

  @Get(':videoId')
  public async findAllComplaints(@Param('videoId') videoId: string) {
    return await this.complaintsService.findAllComplaints(videoId);
  }

  @Delete(':id')
  @Roles(UserRoleEnum.ADMIN)
  public async deleteComplaint(@Param('id') id: string) {
    return await this.complaintsService.deleteComplaints(id);
  }
}
