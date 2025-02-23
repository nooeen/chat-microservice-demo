import { Injectable } from "@nestjs/common";
import { BaseRepositoryAbstract } from "@app/share";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepositoryInterface } from "@app/share/base/database/base.repository.interface";
import { MessageModel } from "./message.schema";

export type MessageRepositoryInterface = BaseRepositoryInterface<MessageModel>;

@Injectable()
export class MessageRepository
  extends BaseRepositoryAbstract<MessageModel>
  implements BaseRepositoryInterface<MessageModel> {
  constructor(
    @InjectModel(MessageModel.name)
    private readonly dbModel: Model<MessageModel>
  ) {
    super(dbModel);
  }
}
