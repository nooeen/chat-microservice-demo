import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_COMMANDS, CHAT_COMMANDS, MICROSERVICE_KEYS } from '@app/share';
import { RegisterBodyDto } from './dto/register-body.dto';
import { GetRecentConversationRequestDto } from 'apps/chat/src/dto/get-recent-conversation.dto';
import { GetRecentConversationResponseDto } from 'apps/chat/src/dto/get-recent-conversation.dto';
import { GetConversationRequestDto } from 'apps/chat/src/dto/get-conversation.dto';
import { GetConversationResponseDto } from 'apps/chat/src/dto/get-conversation.dto';
import { GetActiveUsersResponseDto, GetActiveUsersRequestDto } from 'apps/chat/src/dto/get-active-users.dto';
@Injectable()
export class ApiService {
  constructor(
    @Inject(MICROSERVICE_KEYS.AUTH) private readonly authClient: ClientProxy,
    @Inject(MICROSERVICE_KEYS.CHAT) private readonly chatClient: ClientProxy,
  ) {}

  register(body: RegisterBodyDto) {
    try {
      return this.authClient.send({ cmd: AUTH_COMMANDS.REGISTER }, body);
    } catch (error) {
      throw new error;
    }
  }

  getRecentConversations(username: string) {
    try {
      return this.chatClient.send<GetRecentConversationResponseDto, GetRecentConversationRequestDto>({ cmd: CHAT_COMMANDS.GET_RECENT_CONVERSATIONS }, { username });
    } catch (error) {
      throw new error;
    }
  }

  getConversation(sender: string, receiver: string) {
    try {
      return this.chatClient.send<GetConversationResponseDto, GetConversationRequestDto>({ cmd: CHAT_COMMANDS.GET_CONVERSATION }, { sender, receiver });
    } catch (error) {
      throw new error;
    }
  }

  getActiveUsers(username: string) {
    try {
      return this.chatClient.send<GetActiveUsersResponseDto, GetActiveUsersRequestDto>({ cmd: CHAT_COMMANDS.GET_ACTIVE_USERS }, { username });
    } catch (error) {
      throw new error;
    }
  }
}
