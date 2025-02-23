import { IsArray, IsString } from "class-validator";

import { IsNotEmpty } from "class-validator";

export class GetRecentConversationRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}

class RecentConversation {
  @IsString()
  @IsNotEmpty()
  conversation_id: string;

  @IsString()
  last_message: string;

  @IsString()
  last_sender: string;
}

export class GetRecentConversationResponseDto {
  @IsArray()
  @IsNotEmpty()
  conversations: RecentConversation[];
}
