import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './user.schema';
import { UserRepository } from './user.repository';
import { UserService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      name: UserModel.name,
      collection: 'users',
      useFactory: () => {
        const schema = UserSchema;
        schema.pre('find', function () {
          this.where({
            deleted_at: null,
          });
        });
        schema.pre('findOne', function () {
          this.where({ deleted_at: null });
        });
        return schema;
      },
    }]),
  ],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UsersModule {}
