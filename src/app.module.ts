import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RedisModule } from './cache/redis/redis.module';

@Module({
  imports: [NotificationsModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
