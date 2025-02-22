import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { RabbitMQConfigType } from '@app/share/modules/configuration/configs/rabbitmq.config';
import { CONFIG_KEYS } from '@app/share';
async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get<ConfigService>(ConfigService);

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
  );

  await app.startAllMicroservices();
}

bootstrap();
