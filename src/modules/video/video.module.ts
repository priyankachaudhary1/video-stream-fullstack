import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoEntity } from 'src/entities/video.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity]), CloudinaryModule],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
