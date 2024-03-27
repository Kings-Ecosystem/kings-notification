import { Controller, Sse, Post, Body, Res } from '@nestjs/common';
import { interval, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { INotification } from 'src/models/interfaces/notification.interface';
import { NotificationsService } from './notifications.service';
import { Response } from 'express';
import { EventPattern } from '@nestjs/microservices';
import { MICROSERVICE_EVENTS } from 'src/common/constants/microservice.constants';

@Controller('notifications')
export class NotificationsController {

    private data: any = {};

    constructor(private notificationsService: NotificationsService) { }

    @Post("send")
    async sendEmail(@Body() payload: any, @Res() res: Response) {
        const response = await this.notificationsService.sendEmail(payload);
        res.status(200).send(response)
    }

    @Post("push/send")
    async setData(@Body() payload: any) {
        const res = await this.notificationsService.push(payload);
        this.data = payload;
        return res;
    }

    @EventPattern(MICROSERVICE_EVENTS.PRODUCT_THRESHOLD_REACHED)
    async handler(data: Record<string, unknown>) {
        // this.data = data;
        console.log('The streamed data is => ', this.data);
    }

    @Sse('pull')
    @EventPattern(MICROSERVICE_EVENTS.PRODUCT_THRESHOLD_REACHED)
    async sse() {
        this.getData();
        return interval(5000).pipe(map((_) => ({ data: { num: this.data } })));
    }

    private getData() {
        let num = this.data?.num ?? 1;
        num += 10;
        this.data.num = num;
        console.log('This is now Data',this.data);
        return num;
    }

}
