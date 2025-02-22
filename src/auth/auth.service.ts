import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: { username: string; password: string }) {
    // In a real application, validate user credentials here
    const payload = { username: user.username, sub: '123' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
} 