import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { VideoCategoryModule } from './modules/video-category/video-category.module';
import { VideoModule } from './modules/video/video.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { ComplaintsModule } from './modules/complaints/complaints.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { GameScheduleModule } from './modules/game-schedule/game-schedule.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
          synchronize: true,
        }),
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          service: 'Gmail',
          port: 465,
          secure: false,
          auth: {
            user: process.env.MAILDOMAIN,
            pass: process.env.PASSWORD,
          },
        },
        defaults: {
          from: `"nest-modules" <modules@nestjs.com>`,
        },
      }),
    }),
    AuthModule,
    UserModule,
    VideoCategoryModule,
    VideoModule,
    FeedbackModule,
    ComplaintsModule,
    GameScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
