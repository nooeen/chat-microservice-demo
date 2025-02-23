import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ChatService } from './chat.service';
import { SaveMessageRequestDto, SaveMessageResponseDto } from './dto/save-message.dto';
import { GetConversationRequestDto, GetConversationResponseDto } from './dto/get-conversation.dto';
import { GetRecentConversationRequestDto, GetRecentConversationResponseDto } from './dto/get-recent-conversation.dto';
import { CHAT_COMMANDS } from '@app/share';
@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @MessagePattern({ cmd: CHAT_COMMANDS.SAVE_MESSAGE })
  async saveMessage(data: SaveMessageRequestDto): Promise<SaveMessageResponseDto> {
    return this.chatService.saveMessage(data);
  }

  @MessagePattern({ cmd: CHAT_COMMANDS.GET_CONVERSATION })
  async getConversation(data: GetConversationRequestDto): Promise<GetConversationResponseDto> {
    console.log('data', data);
    return this.chatService.getConversation(data);
  }

  @MessagePattern({ cmd: CHAT_COMMANDS.GET_RECENT_CONVERSATIONS })
  async getRecentConversations(data: GetRecentConversationRequestDto): Promise<GetRecentConversationResponseDto> {
    return this.chatService.getRecentConversations(data);
  }
} 