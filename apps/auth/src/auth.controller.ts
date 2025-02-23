import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AUTH_COMMANDS } from '@app/share';
import { CustomRpcExceptionFilter } from '@app/share/filters/rpc-exception.filter';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: AUTH_COMMANDS.REGISTER })
  @UseFilters(new CustomRpcExceptionFilter())
  async register(data: { username: string; password: string }) {
    return await this.authService.register(data);
  }

  @MessagePattern({ cmd: AUTH_COMMANDS.VALIDATE_USER })
  async validateUser(data: { username: string; password: string }) {
    return await this.authService.validateUser(data);
  }

  @MessagePattern({ cmd: AUTH_COMMANDS.GENERATE_TOKEN })
  async generateToken(data: { username: string }) {
    return await this.authService.generateToken(data);
  }

  @MessagePattern({ cmd: AUTH_COMMANDS.VALIDATE_TOKEN })
  async validateToken(data: { token: string }) {
    return await this.authService.validateToken(data.token);
  }
} 
