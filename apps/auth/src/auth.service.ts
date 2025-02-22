import { UserService } from '@app/users';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userService: UserService) {}

  async register(user: { username: string; password: string }) {
    const userExists = await this.userService.findOne({ filter: { username: user.username } });
    if (userExists) {
      throw new RpcException('User already exists');
    }

    const createdUser = await this.userService.create(user);
    const payload = { username: createdUser.username };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(user: { username: string; password: string }) {
    const userExists = await this.userService.findOne({ filter: { username: user.username } });
    if (!userExists) {
      throw new RpcException('User not found');
    }

    if (userExists.password !== user.password) {
      throw new RpcException('Invalid password');
    }

    return userExists;
  }

  async generateToken(user: { username: string }) {
    const payload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
} 