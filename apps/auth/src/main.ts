import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { RabbitMQConfigType } from '@app/share/modules/configuration/configs/rabbitmq.config';
import { CONFIG_KEYS } from '@app/share';
import { ValidationPipe } from '@nestjs/common';
import { CustomRpcExceptionFilter } from '@app/share/filters/rpc-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useGlobalFilters(new CustomRpcExceptionFilter());

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<RabbitMQConfigType>(CONFIG_KEYS.RABBITMQ).uri],
        queue: configService.get<RabbitMQConfigType>(CONFIG_KEYS.RABBITMQ).queue,
        queueOptions: {
          durable: true,
        },
      },
    },
    {
      inheritAppConfig: true,
    },
  );

  await app.startAllMicroservices();
}

bootstrap();
