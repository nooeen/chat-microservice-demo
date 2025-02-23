import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RedisIoAdapter } from './redis-io.adapter';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';


async function bootstrap() {
  process.env.NODE_INSTANCE_ID = crypto.randomBytes(16).toString('hex');

  const app = await NestFactory.create<NestExpressApplication>(ApiModule, {
    cors: true,
  });

  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  const redisIoAdapter = new RedisIoAdapter(configService);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });
  app.enable("trust proxy");
  app.disable("x-powered-by");
  app.disable("view cache");

  app.use(cookieParser());
  app.use(compression());

  await app.listen(process.env.API_PORT ?? 3000);
  console.log(`---------- API_PORT: ${process.env.API_PORT ?? 3000} ----------`);
}

bootstrap();
