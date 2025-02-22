import { IsNotEmpty, IsString } from "class-validator";

export class RegisterBodyDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
