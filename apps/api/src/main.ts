import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ApiModule, {
    cors: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

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

  await app.listen(process.env.PORT ?? 3000);
  console.log(`---------- API_PORT: ${process.env.PORT ?? 3000} ----------`);
}

bootstrap();
