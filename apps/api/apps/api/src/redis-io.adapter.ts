import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from '@app/share';
import { RedisConfigType } from '@app/share/modules/configuration/configs/redis.config';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  constructor(private readonly configService: ConfigService) {
    super();
  }

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      url: `redis://${this.configService.get<RedisConfigType>(CONFIG_KEYS.REDIS).auth ? `:${this.configService.get<RedisConfigType>(CONFIG_KEYS.REDIS).password}` : ""}@${this.configService.get<RedisConfigType>(CONFIG_KEYS.REDIS).host
        }:${this.configService.get<RedisConfigType>(CONFIG_KEYS.REDIS).port}`,
      database: this.configService.get<RedisConfigType>(CONFIG_KEYS.REDIS).db,
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
