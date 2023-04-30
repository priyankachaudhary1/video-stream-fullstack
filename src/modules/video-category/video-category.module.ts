import { Module } from '@nestjs/common';
import { VideoCategoryController } from './video-category.controller';
import { VideoCategoryService } from './video-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoCategoryEntity } from 'src/entities/video-category.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([VideoCategoryEntity]), UserModule],
  controllers: [VideoCategoryController],
  providers: [VideoCategoryService],
})
export class VideoCategoryModule {}
