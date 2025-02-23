import { IsString } from "class-validator";

import { IsNotEmpty } from "class-validator";

export class GetRecentConversationRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
