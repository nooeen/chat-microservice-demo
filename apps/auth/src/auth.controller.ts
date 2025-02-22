import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AUTH_COMMANDS } from '@app/share';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: AUTH_COMMANDS.REGISTER })
  async register(data: { username: string; password: string }) {
    return this.authService.register(data);
  }

  @MessagePattern({ cmd: AUTH_COMMANDS.VALIDATE_USER })
  async validateUser(data: { username: string; password: string }) {
    return this.authService.validateUser(data);
  }

  @MessagePattern({ cmd: AUTH_COMMANDS.GENERATE_TOKEN })
  async generateToken(data: { username: string }) {
    return this.authService.generateToken(data);
  }
} 
