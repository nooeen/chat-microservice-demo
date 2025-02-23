import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ShareModule } from '@app/share';
import { UsersModule } from '@app/users';
import { MessagesModule } from '@app/messages';
import { ConversationsModule } from '@app/conversations';
import { RedisModule } from '@app/share';
@Module({
  imports: [ShareModule, RedisModule, UsersModule, MessagesModule, ConversationsModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {} 