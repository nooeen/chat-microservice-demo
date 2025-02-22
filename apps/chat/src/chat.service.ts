import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  private messages: any[] = [];

  async sendMessage(message: { from: string; content: string }) {
    const newMessage = {
      ...message,
      timestamp: new Date(),
    };
    this.messages.push(newMessage);
    return newMessage;
  }

  async getMessages() {
    return this.messages;
  }
} 