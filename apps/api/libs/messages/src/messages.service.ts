import { Injectable } from "@nestjs/common";
import { BaseServiceAbstract } from "@app/share";
import { MessageModel } from "./message.schema";
import { MessagesRepository } from "./messages.repository";

@Injectable()
export class MessagesService extends BaseServiceAbstract<MessageModel> {
  constructor(private repo: MessagesRepository) {
    super(repo);
  }
}
