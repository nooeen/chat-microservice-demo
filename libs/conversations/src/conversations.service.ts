import { Injectable } from "@nestjs/common";
import { BaseServiceAbstract } from "@app/share";
import { ConversationModel } from "./conversation.schema";
import { ConversationRepository } from "./conversations.repository";

@Injectable()
export class ConversationService extends BaseServiceAbstract<ConversationModel> {
  constructor(private repo: ConversationRepository) {
    super(repo);
  }
}
