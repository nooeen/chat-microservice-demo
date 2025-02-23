import { IsArray, IsString } from "class-validator";

export class GetActiveUsersResponseDto {
  @IsArray()
  @IsString({ each: true })
  usernames: string[];
}

export class GetActiveUsersRequestDto {
  @IsString()
  username: string;
}