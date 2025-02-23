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
export class ConversationModel extends BaseSchema {
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  public user_id_1: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  public user_id_2: string;
}

export type ConversationDocument = ConversationModel & mongoose.Document;
const schema = SchemaFactory.createForClass(ConversationModel);

schema.pre("save", function (this: ConversationModel, next) {
  this.updated_at = Date.now();
  next();
});
schema.loadClass(ConversationModel);

export const ConversationSchema = schema;
