import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @MessagePattern({ cmd: 'send_message' })
  // @UseGuards(AuthGuard('jwt'))
  async sendMessage(data: { from: string; content: string }) {
    return this.chatService.sendMessage(data);
  }

  @MessagePattern({ cmd: 'get_messages' })
  // @UseGuards(AuthGuard('jwt'))
  async getMessages() {
    return this.chatService.getMessages();
  }
} 