import { BaseSchema } from "@app/share";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

@Schema({
  // _id: false,
  // id: false,
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  toJSON: {
    getters: true,
  },
  versionKey: false,
})
export class MessageModel extends BaseSchema {
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  public conversation_id: string;

  @Prop({
    type: String,
    required: true,
  })
  public sender_id: string;

  @Prop({
    type: String,
    required: true,
  })
  public message: string;
}

export type MessageDocument = MessageModel & mongoose.Document;
const schema = SchemaFactory.createForClass(MessageModel);

schema.pre("save", function (this: MessageModel, next) {
  this.updated_at = Date.now();
  next();
});
schema.loadClass(MessageModel);

export const MessageSchema = schema;
