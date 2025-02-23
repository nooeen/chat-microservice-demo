import { Injectable } from "@nestjs/common";
import { BaseRepositoryAbstract } from "@app/share";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepositoryInterface } from "@app/share/base/database/base.repository.interface";
import { UserModel } from "./user.schema";

export type UserRepositoryInterface = BaseRepositoryInterface<UserModel>;

@Injectable()
export class UserRepository
  extends BaseRepositoryAbstract<UserModel>
  implements BaseRepositoryInterface<UserModel> {
  constructor(
    @InjectModel(UserModel.name)
    private readonly dbModel: Model<UserModel>
  ) {
    super(dbModel);
  }
}
