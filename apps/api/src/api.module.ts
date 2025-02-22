import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { MICROSERVICE_KEYS, ShareModule } from '@app/share';
import { Transport } from '@nestjs/microservices';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RabbitMQConfigType } from '@app/share/modules/configuration/configs/rabbitmq.config';
import { CONFIG_KEYS } from '@app/share';

@Module({
  imports: [ShareModule, ClientsModule.registerAsync([
    {
      name: MICROSERVICE_KEYS.AUTH,
      useFactory: (configService: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [configService.get<RabbitMQConfigType>(CONFIG_KEYS.RABBITMQ).uri],
          queue: configService.get<RabbitMQConfigType>(CONFIG_KEYS.RABBITMQ).queue,
          queueOptions: {
            durable: true,
          },
        },
      }),
    },
  ]),
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
