import { Injectable } from '@nestjs/common';
import { INotification } from 'src/models/interfaces/notification.interface';
import { RedisService } from 'src/cache/redis/redis.service';

@Injectable()
export class NotificationsService {

    async push(notification: INotification) {
        const cache = RedisService.client;
        const res = await cache.set("message", JSON.stringify(notification));
        return res;
    }

    async pull(): Promise<INotification> {
        const cache = RedisService.client;
        let res = await cache.get("message");
        return JSON.parse(res);
    }

     async sendEmail(payload: INotification) {

  }
}
