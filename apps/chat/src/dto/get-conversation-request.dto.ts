import { IsNotEmpty } from "class-validator";

import { IsString } from "class-validator";

export class GetConversationRequestDto {
  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  receiver: string;
}
