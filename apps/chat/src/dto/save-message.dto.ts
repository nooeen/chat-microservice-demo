import { IsString } from "class-validator";

import { IsNotEmpty } from "class-validator";

export class SaveMessageDto {
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

