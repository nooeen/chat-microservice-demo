import { Injectable } from "@nestjs/common";
import { BaseServiceAbstract } from "@app/share";
import { ConversationModel } from "./conversation.schema";
import { ConversationsRepository } from "./conversations.repository";

@Injectable()
export class ConversationsService extends BaseServiceAbstract<ConversationModel> {
  constructor(private repo: ConversationsRepository) {
    super(repo);
  }
}
