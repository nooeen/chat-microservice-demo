import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModel, MessageSchema } from './message.schema';
import { MessagesRepository } from './messages.repository';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      name: MessageModel.name,
      collection: 'messages',
      useFactory: () => {
        const schema = MessageSchema;
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
  providers: [MessagesRepository, MessagesService],
  exports: [MessagesService],
})
export class MessagesModule { }
