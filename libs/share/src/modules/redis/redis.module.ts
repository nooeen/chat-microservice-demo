import { Module } from "@nestjs/common";
import { RedisModule as RedisNestModule } from "@nestjs-modules/ioredis";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "./redis.service";
import { RedisConfigType } from "../configuration/configs/redis.config";
import { CONFIG_KEYS } from "../../common/constants";

@Module({
  imports: [
    RedisNestModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get<RedisConfigType>(
          CONFIG_KEYS.REDIS
        );

        return {
          type: "single",
          url: `redis://${redisConfig.auth ? `:${redisConfig.password}` : ""}@${
            redisConfig.host
          }:${redisConfig.port}`,
          options: {
            db: redisConfig.db,
            ...(redisConfig.prefix &&
              redisConfig.prefix.length && {
                keyPrefix: `${redisConfig.prefix}_`,
              }),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
