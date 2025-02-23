import { MessageModel } from "@app/messages/message.schema";
import { IsArray, IsNotEmpty } from "class-validator";

import { IsString } from "class-validator";

export class GetConversationResponseDto {
  @IsString()
  @IsNotEmpty()
  conversation_id: string;

  @IsArray()
  @IsNotEmpty()
  messages: MessageModel[];
}
