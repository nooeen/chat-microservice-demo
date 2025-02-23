import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { ConfigService } from "@nestjs/config";
import { RedisConfigType } from "../configuration/configs/redis.config";
import { CONFIG_KEYS } from "../../common/constants"; 

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const queueConfig = configService.get<RedisConfigType>(
          CONFIG_KEYS.QUEUE
        );

        return {
          redis: {
            host: queueConfig.host,
            port: queueConfig.port,
            ...(queueConfig.auth && {
              password: queueConfig.password,
            }),
            db: Number(queueConfig.db),
          },
          prefix: queueConfig.prefix,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [],
})
export class QueueModule {}
