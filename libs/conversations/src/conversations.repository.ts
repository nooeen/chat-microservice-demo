import { Injectable } from "@nestjs/common";
import { BaseRepositoryAbstract } from "@app/share";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepositoryInterface } from "@app/share/base/database/base.repository.interface";
import { ConversationModel } from "./conversation.schema";

export type ConversationsRepositoryInterface = BaseRepositoryInterface<ConversationModel>;

@Injectable()
export class ConversationsRepository
  extends BaseRepositoryAbstract<ConversationModel>
  implements BaseRepositoryInterface<ConversationModel> {
  constructor(
    @InjectModel(ConversationModel.name)
    private readonly dbModel: Model<ConversationModel>
  ) {
    super(dbModel);
  }
}
