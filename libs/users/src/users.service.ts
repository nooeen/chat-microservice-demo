import { Injectable } from "@nestjs/common";
import { BaseServiceAbstract } from "@app/share";
import { UserModel } from "./user.schema";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService extends BaseServiceAbstract<UserModel> {
  constructor(private repo: UserRepository) {
    super(repo);
  }
}
