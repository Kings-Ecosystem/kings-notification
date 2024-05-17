/* eslint-disable prettier/prettier */
import { Controller, Sse, Post, Body, Res, MessageEvent, Param } from '@nestjs/common';
import { Observable, interval, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { INotification } from 'src/models/interfaces/notification.interface';
import { NotificationsService } from './notifications.service';
import { Response } from 'express';
import { EventPattern } from '@nestjs/microservices';
import { MICROSERVICE_EVENTS } from 'src/common/constants/microservice.constants';
import { CacheManager } from 'src/cache/redis/cache.utils';

@Controller('notifications')
export class NotificationsController {

    constructor(private notificationsService: NotificationsService) { }

    @EventPattern(MICROSERVICE_EVENTS.SEND_USER_EMAIL)
    async sendUserEmail(@Body() payload: any, @Res() res: Response) {
        const response =  await this.notificationsService.sendEmail(payload);
        res.status(200).send(response)
    }

    @EventPattern(MICROSERVICE_EVENTS.PRODUCT_THRESHOLD_REACHED)
    async sendEmailToOrgAdmin(@Body() payload: any, @Res() res: Response) {
        const response =  await this.notificationsService.sendEmail(payload);
        res.status(200).send(response)
    }

    @Post("push/send")
    async setData(@Body() payload: any) {
        const res = await this.notificationsService.push(payload);
        return res;
    }

    // Cache product threshold message for fast pulling fron frontend notifications
    @EventPattern(MICROSERVICE_EVENTS.PRODUCT_THRESHOLD_REACHED)
    async handler(data: Record<string, any>) {
        await CacheManager.set(data?.organization?.owner_id ?? "notification", data);
    }

    @Sse('pull/:id')
    sse(@Param() param: { id: string }): Observable<MessageEvent> {
        let data = {};
        const notificationsData = interval(5000).pipe(map((_) => {
            this.getCachedData(param.id).then((value) => {
                data = value;
            })
            return ({ data });
        }));
        return notificationsData;
    }

    private async getCachedData(key: string) {
        const data = await CacheManager.get(key ?? "notification");
        return data;
    }

}
