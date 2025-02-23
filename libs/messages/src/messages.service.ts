import { Injectable } from "@nestjs/common";
import { BaseServiceAbstract } from "@app/share";
import { MessageModel } from "./message.schema";
import { MessageRepository } from "./messages.repository";

@Injectable()
export class MessageService extends BaseServiceAbstract<MessageModel> {
  constructor(private repo: MessageRepository) {
    super(repo);
  }
}
