import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationModel, ConversationSchema } from './conversation.schema';
import { ConversationsRepository } from './conversations.repository';
import { ConversationsService } from './conversations.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      name: ConversationModel.name,
      collection: 'conversations',
      useFactory: () => {
        const schema = ConversationSchema;
        schema.pre('find', function () {
          this.where({
            deleted_at: null,
          });
        });
        schema.pre('findOne', function () {
          this.where({ deleted_at: null });
        });
        return schema;
      },
    }]),
  ],
  providers: [ConversationsRepository, ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule { }
