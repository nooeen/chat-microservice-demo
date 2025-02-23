import { MessageModel } from "@app/messages/message.schema";
import { IsString } from "class-validator";
import { IsNotEmpty } from "class-validator";

export class SaveMessageRequestDto {
  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  receiver: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class SaveMessageResponseDto {
  status: number;
  message: MessageModel;
}

