import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { buildRedisConfig } from "./redis.config";
import { redisConfigSchema } from "./schemas/redis.schema";
import { buildMongoDBConfig } from "./mongodb.config";
import { mongodbConfigSchema } from "./schemas/mongodb.schema";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [
        buildRedisConfig,
        buildMongoDBConfig,
        // buildQueueConfig,
        // buildMeilisearchConfig,
      ],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("development", "production", "test", "provision", "staging")
          .default("development"),
        WEB_PORT: Joi.number().default(3000),
        API_PORT: Joi.number().default(3004),
        ...redisConfigSchema(true), // REDIS CACHE
        ...mongodbConfigSchema(true), // MONGODB & DB CACHE
        // ...redisConfigSchema(true, "QUEUE"), // BULLMQ
        // ...meilisearchConfigSchema(true), // MEILISEARCH
      }),
    }),
  ],
})
export class ConfigurationModule {}
