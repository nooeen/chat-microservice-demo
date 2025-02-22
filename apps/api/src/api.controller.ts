import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiService } from './api.service';
import { LocalAuthGuard } from './guards/local.guard';
import { API_PATHS } from '@app/share';
import { JwtAuthGuard } from './guards/jwt.guard';
@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post(API_PATHS.REGISTER)
  register(@Body() body: { username: string; password: string }) {
    return this.apiService.register(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post(API_PATHS.LOGIN)
  login(@Body() body: { username: string }) {
    return this.apiService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post(API_PATHS.VALIDATE_TOKEN)
  validateToken(@Body() body: { token: string }) {
    return this.apiService.validateToken(body);
  }
}
