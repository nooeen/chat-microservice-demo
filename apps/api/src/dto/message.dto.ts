import { IsNotEmpty, IsString } from "class-validator";

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  receiver: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
