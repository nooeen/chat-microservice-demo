import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ChatService } from './chat.service';
import { SaveMessageDto } from './dto/save-message.dto';
import { GetConversationRequestDto } from './dto/get-conversation-request.dto';
import { GetRecentConversationRequestDto } from './dto/get-recent-conversation-request.dto';
import { CHAT_COMMANDS } from '@app/share';
@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @MessagePattern({ cmd: CHAT_COMMANDS.SAVE_MESSAGE })
  async saveMessage(data: SaveMessageDto) {
    return this.chatService.saveMessage(data);
  }

  @MessagePattern({ cmd: CHAT_COMMANDS.GET_CONVERSATION })
  async getConversation(data: GetConversationRequestDto) {
    return this.chatService.getConversation(data);
  }

  @MessagePattern({ cmd: CHAT_COMMANDS.GET_RECENT_CONVERSATIONS })
  async getRecentConversations(data: GetRecentConversationRequestDto) {
    return this.chatService.getRecentConversations(data);
  }
} 