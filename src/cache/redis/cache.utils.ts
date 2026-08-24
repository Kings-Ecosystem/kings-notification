/* eslint-disable prettier/prettier */
import { RedisService } from 'src/cache/redis/redis.service';

export class CacheManager {

    static channelFor(key: string) {
        return `sse:${String(key)}`;
    }

    static async set(key: string, data: any) {
        try {
            const cache = RedisService.client;
            let prevData = await CacheManager.get(key);
            prevData = prevData ? prevData : {};
            const newData = { ...prevData, ...data };
            const serialized = JSON.stringify(newData);
            await cache.set(key.toString(), serialized);
            try {
                await cache.publish(CacheManager.channelFor(key), serialized);
            } catch (publishError) {
                console.log("Error publishing SSE notification ", publishError?.message);
            }
            return true;
        } catch (error) {
            console.log("Error in setting to cache ", error?.message);
            return false;
        }
    }

    static async get(key: string) {
        try {
            const cache = RedisService.client;
            const response = await cache.get(key.toString());
            return JSON.parse(response);
        } catch (error) {
            console.log("Error in getting from cache ", error?.message);
            return false;
        }
    }

}
