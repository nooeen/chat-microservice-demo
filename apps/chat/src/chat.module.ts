import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ConfigurationModule } from '@app/configuration';

@Module({
  imports: [ConfigurationModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {} 