/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RedisModule } from './cache/redis/redis.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), NotificationsModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
