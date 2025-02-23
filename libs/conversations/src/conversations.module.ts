import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationModel, ConversationSchema } from './conversation.schema';
import { ConversationRepository } from './conversations.repository';
import { ConversationService } from './conversations.service';

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
  providers: [ConversationRepository, ConversationService],
  exports: [ConversationService],
})
export class ConversationsModule { }
