import { MessageModel } from "@app/messages/message.schema";
import { IsArray, IsNotEmpty } from "class-validator";
import { IsString } from "class-validator";

export class GetConversationRequestDto {
  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  receiver: string;
}

export class GetConversationResponseDto {
  @IsString()
  @IsNotEmpty()
  conversation_id: string;

  @IsArray()
  @IsNotEmpty()
  messages: MessageModel[];
}