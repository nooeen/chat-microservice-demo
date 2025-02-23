import { Injectable } from '@nestjs/common';
import { SaveMessageDto } from './dto/save-message.dto';
import { GetConversationRequestDto } from './dto/get-conversation-request.dto';
import { ConversationRepository } from '@app/conversations/conversations.repository';
import { MessageRepository } from '@app/messages/messages.repository';
import { RpcException } from '@nestjs/microservices';
import { GetConversationResponseDto } from './dto/get-conversation-response.dto';
import { GetRecentConversationRequestDto } from './dto/get-recent-conversation-request.dto';
import { GetRecentConversationResponseDto } from './dto/get-recent-conversation-response.dto';
import { ConversationDocument, ConversationModel } from '@app/conversations/conversation.schema';
@Injectable()
export class ChatService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository
  ) { }

  async saveMessage({ sender, receiver, content }: SaveMessageDto) {
    try {
      let conversation: ConversationDocument | ConversationModel;

      conversation = await this.conversationRepository.findOne({
        filter: {
          $or: [
            { $and: [{ username_1: sender }, { username_2: receiver }] },
            { $and: [{ username_1: receiver }, { username_2: sender }] },
          ],
        },
      });

      if (!conversation) {
        conversation = await this.conversationRepository.create({
          username_1: sender,
          username_2: receiver,
        });
      }

      await this.conversationRepository.updateOne(
        { _id: conversation._id },
        { $set: { updated_at: new Date() } }
      );

      const newMessage = await this.messageRepository.create({
        conversation_id: conversation._id.toString(),
        sender,
        content,
      });

      return newMessage;
    } catch (error) {
      throw new RpcException('Failed to save message');
    }
  }

  async getConversation({ sender, receiver }: GetConversationRequestDto): Promise<GetConversationResponseDto> {
    try {
      const conversation = await this.conversationRepository.findOne({
        filter: {
          $or: [
            { $and: [{ username_1: sender }, { username_2: receiver }] },
            { $and: [{ username_1: receiver }, { username_2: sender }] },
          ],
        },
      });

      const messages = await this.messageRepository.find({
        filter: {
          conversation_id: conversation._id.toString(),
        },
        sort: {
          created_at: -1,
        },
      });

      return {
        conversation_id: conversation._id.toString(),
        messages,
      };
    } catch (error) {
      throw new RpcException('Failed to get conversation');
    }
  }

  async getRecentConversations({ username }: GetRecentConversationRequestDto): Promise<GetRecentConversationResponseDto> {
    try {
      const conversationsQuery = await this.conversationRepository.find({
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

      const conversations = await Promise.all(conversationsQuery.map(async (conversation) => {
        const lastMessage = await this.messageRepository.findOne({
          filter: {
            conversation_id: conversation._id.toString(),
          },
          sort: {
            created_at: -1,
          },
        });

        return {
          conversation_id: conversation._id.toString(),
          last_message: lastMessage.content,
          last_sender: lastMessage.sender,
        };
      }));

      return {
        conversations,
      };
    } catch (error) {
      throw new RpcException('Failed to get recent conversations');
    }
  }
}
