/* eslint-disable prettier/prettier */
import { Controller, Sse, Post, Body, MessageEvent, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { MICROSERVICE_EVENTS } from 'src/common/constants/microservice.constants';
import { CacheManager } from 'src/cache/redis/cache.utils';
import { RedisService } from 'src/cache/redis/redis.service';

@Controller('notifications')
export class NotificationsController {

    constructor(private notificationsService: NotificationsService) { }

    @EventPattern(MICROSERVICE_EVENTS.SEND_USER_EMAIL)
    async sendUserEmail(@Body() payload: any) {
        await this.notificationsService.sendEmail(payload);
    }

    @MessagePattern({ cmd: MICROSERVICE_EVENTS.SEND_USER_EMAIL })
    async sendUserEmailRpc(@Payload() payload: any) {
        await this.notificationsService.sendEmail(payload);
        return { ok: true };
    }

    @EventPattern(MICROSERVICE_EVENTS.PRODUCT_THRESHOLD_REACHED)
    async sendEmailToOrgAdmin(@Body() payload: any) {
        await this.notificationsService.sendEmail(payload);
        await CacheManager.set(payload?.organization?.owner_id ?? "notification", payload);
    }

    @Post("push/send")
    async setData(@Body() payload: any) {
        const res = await this.notificationsService.push(payload);
        return res;
    }

    @EventPattern(MICROSERVICE_EVENTS.NOTIFICATIONS)
    async notifHandler(data: Record<string, any>) {
        const activity = `${data?.data.platform.actionEvent}_${data?.request?.user?.id}`
        const notification = {
            [activity]: {
                [data?.request?.user?.id]: data?.request?.user,
                data: data?.data,
                time: new Date()
            },
        }
        const ownerId = data?.request?.user?.owner_id ?? data?.request?.user?.id ?? "notification";
        await CacheManager.set(ownerId, notification);
        const userId = Number(data?.request?.user?.id);
        if (userId) {
            await this.notificationsService.push({
                userId,
                title: 'Fluide Campus',
                body: data?.data?.message || data?.data?.platform?.actionEvent || 'New update',
            } as any);
        }
    }

    @Sse('pull/:id')
    sse(@Param() param: { id: string }): Observable<MessageEvent> {
        const key = param.id ?? 'notification';
        const channel = CacheManager.channelFor(key);

        return new Observable((subscriber) => {
            let heartbeat: ReturnType<typeof setInterval> | undefined;
            let subClient: any;
            let closed = false;

            const send = (data: any) => {
                if (!closed) {
                    subscriber.next({ data: data ?? {} });
                }
            };

            (async () => {
                send(await this.getCachedData(key) || {});
                if (!RedisService.client?.duplicate) {
                    return;
                }
                subClient = RedisService.client.duplicate();
                await subClient.connect();
                await subClient.subscribe(channel, (message: string) => {
                    try {
                        send(JSON.parse(message));
                    } catch {
                        send(message);
                    }
                });
            })().catch((error) => {
                console.log('SSE subscribe failed', error?.message);
            });

            heartbeat = setInterval(() => {
                send({ type: 'heartbeat', t: Date.now() });
            }, 30000);

            return () => {
                closed = true;
                if (heartbeat) {
                    clearInterval(heartbeat);
                }
                if (subClient) {
                    Promise.resolve()
                        .then(() => subClient.unsubscribe(channel))
                        .then(() => subClient.quit())
                        .catch(() => undefined);
                }
            };
        });
    }

    private async getCachedData(key: string) {
        const data = await CacheManager.get(key ?? "notification");
        return data;
    }

}
