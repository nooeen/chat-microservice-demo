import { Injectable } from '@nestjs/common';
import { SaveMessageRequestDto, SaveMessageResponseDto } from './dto/save-message.dto';
import { GetConversationRequestDto } from './dto/get-conversation.dto';
import { MessagesService } from '@app/messages';
import { GetConversationResponseDto } from './dto/get-conversation.dto';
import { GetRecentConversationRequestDto } from './dto/get-recent-conversation.dto';
import { GetRecentConversationResponseDto } from './dto/get-recent-conversation.dto';
import { ConversationDocument, ConversationModel } from '@app/conversations/conversation.schema';
import { ConversationsService } from '@app/conversations';
import { RedisService } from '@app/share/modules/redis/redis.service';
import { GetActiveUsersRequestDto, GetActiveUsersResponseDto } from './dto/get-active-users.dto';
import { REDIS_HASH_KEYS } from '@app/share';
@Injectable()
export class ChatService {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
    private readonly redisService: RedisService
  ) { }

  async saveMessage({ sender, receiver, content }: SaveMessageRequestDto): Promise<SaveMessageResponseDto> {
    try {
      let conversation: ConversationDocument | ConversationModel;

      conversation = await this.conversationsService.findOne({
        filter: {
          $or: [
            { $and: [{ username_1: sender }, { username_2: receiver }] },
            { $and: [{ username_1: receiver }, { username_2: sender }] },
          ],
        },
      });

      if (!conversation) {
        conversation = await this.conversationsService.create({
          username_1: sender,
          username_2: receiver,
        });
      }

      await this.conversationsService.updateOne(
        { _id: conversation._id },
        { $set: { updated_at: new Date() } }
      );

      const newMessage = await this.messagesService.create({
        conversation_id: conversation._id.toString(),
        sender,
        content,
      });

      return {
        status: 200,
        message: newMessage,
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  }

  async getConversation({ sender, receiver }: GetConversationRequestDto): Promise<GetConversationResponseDto> {
    try {
      const conversation = await this.conversationsService.findOne({
        filter: {
          $or: [
            { $and: [{ username_1: sender }, { username_2: receiver }] },
            { $and: [{ username_1: receiver }, { username_2: sender }] },
          ],
        },
      });

      if (!conversation) {
        return {
          conversation_id: null,
          messages: [],
        };
      }

      const messages = await this.messagesService.find({
        filter: {
          conversation_id: conversation._id.toString(),
        },
        sort: {
          // created_at: -1,
          created_at: 1 // Because pagination isn't implemented yet
        },
      });

      return {
        conversation_id: conversation._id.toString(),
        messages,
      };
    } catch (error) {
      return error;
    }
  }

  async getRecentConversations({ username }: GetRecentConversationRequestDto): Promise<GetRecentConversationResponseDto> {
    try {
      const conversationsQuery = await this.conversationsService.find({
        filter: {
          $or: [
            { username_1: username },
            { username_2: username },
          ],
        },
        sort: {
          updated_at: -1,
        },
      });

      if (!conversationsQuery) {
        return {
          conversations: [],
        };
      }

      const conversations = await Promise.all(conversationsQuery.map(async (conversation) => {
        const lastMessage = await this.messagesService.findOne({
          filter: {
            conversation_id: conversation._id.toString(),
          },
          sort: {
            created_at: -1,
          },
        });

        return {
          conversation_id: conversation._id.toString(),
          username: conversation.username_1 === username ? conversation.username_2 : conversation.username_1,
          last_message: lastMessage.content,
          last_sender: lastMessage.sender,
        };
      }));

      return {
        conversations,
      };
    } catch (error) {
      return error;
    }
  }

  async getActiveUsers({ username }: GetActiveUsersRequestDto): Promise<GetActiveUsersResponseDto> {
    try {
      const activeUsers = await this.redisService.hgetall(REDIS_HASH_KEYS.USER_SOCKETS_MAPPING);

      if (!activeUsers) {
        return {
          usernames: [],
        };
      }

      return {
        usernames: Object.keys(activeUsers).filter((user) => user !== username),
      };
    } catch (error) {
      return error;
    }
  }
}
