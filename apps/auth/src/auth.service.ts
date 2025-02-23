import { UserService } from '@app/users';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userService: UserService) { }

  async register(user: { username: string; password: string }) {
    const userExists = await this.userService.findOne({ filter: { username: user.username } });
    
    if (userExists) {
      throw new RpcException({
        statusCode: 400,
        message: 'User already exists',
      });
    }

    const createdUser = await this.userService.create(user);
    const payload = { username: createdUser.username };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(user: { username: string; password: string }) {
    try {
      const userExists = await this.userService.findOne({ filter: { username: user.username } });
      if (!userExists) {
        throw new RpcException({
        statusCode: 400,
        message: 'User not found',
      });
    }

    if (userExists.password !== user.password) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid password',
      });
    }

    return {
        statusCode: 200,
        message: 'User validated',
        user: userExists,
      };
    } catch (error) {
      return error;
    }
  }

  async generateToken(user: { username: string }) {
    const payload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid token',
      });
    }
  }
} 