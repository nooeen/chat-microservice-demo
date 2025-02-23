import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { buildRedisConfig } from "./configs/redis.config";
import { redisConfigSchema } from "./schemas/redis.schema";
import { buildMongoDBConfig } from "./configs/mongodb.config";
import { mongodbConfigSchema } from "./schemas/mongodb.schema";
import { buildJWTConfig } from "./configs/jwt.config";
import { buildRabbitMQConfig } from "./configs/rabbitmq.config";
import { jwtConfigSchema } from "./schemas/jwt.schema";
import { rabbitmqConfigSchema } from "./schemas/rabbitmq.schema";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [
        buildRedisConfig,
        buildMongoDBConfig,
        buildJWTConfig,
        buildRabbitMQConfig,
        // buildQueueConfig,
        // buildMeilisearchConfig,
      ],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("development", "production", "test", "provision", "staging")
          .default("development"),
        API_PORT: Joi.number().default(3000),
        CHAT_PORT: Joi.number().default(3001),
        ...redisConfigSchema(true), // REDIS CACHE
        ...mongodbConfigSchema(true), // MONGODB & DB CACHE
        ...jwtConfigSchema(true), // JWT
        ...rabbitmqConfigSchema(true), // RABBITMQ
        // ...redisConfigSchema(true, "QUEUE"), // BULLMQ
        // ...meilisearchConfigSchema(true), // MEILISEARCH
      }),
    }),
  ],
})
export class ConfigurationModule {}
