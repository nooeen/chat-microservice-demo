import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ChatModule } from './chat.module';
import { ConfigService } from '@nestjs/config';
import { RabbitMQConfigType } from '@app/share/modules/configuration/configs/rabbitmq.config';
import { CONFIG_KEYS } from '@app/share';
import { ValidationPipe } from '@nestjs/common';
import { CustomRpcExceptionFilter } from '@app/share/filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);
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
  await app.listen(process.env.CHAT_PORT ?? 3001);
  console.log(`---------- CHAT_PORT: ${process.env.CHAT_PORT ?? 3001} ----------`);
}

bootstrap();
