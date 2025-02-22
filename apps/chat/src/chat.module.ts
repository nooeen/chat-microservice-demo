import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ShareModule } from '@app/share';

@Module({
  imports: [ShareModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {} 