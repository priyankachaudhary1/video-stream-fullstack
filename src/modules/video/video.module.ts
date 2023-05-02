import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoEntity } from 'src/entities/video.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoEntity]),
    CloudinaryModule,
    UserModule,
  ],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
