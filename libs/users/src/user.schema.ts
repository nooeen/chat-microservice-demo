import { BaseSchema } from "@app/share";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

@Schema({
  _id: false,
  id: false,
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  toJSON: {
    getters: true,
  },
  versionKey: false,
})
export class UserModel extends BaseSchema {
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  public username: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  public password: string;
}

export type UserDocument = UserModel & mongoose.Document;
const schema = SchemaFactory.createForClass(UserModel);

schema.pre("save", function (this: UserModel, next) {
  this.updated_at = Date.now();
  next();
});
schema.loadClass(UserModel);

export const UserSchema = schema;
