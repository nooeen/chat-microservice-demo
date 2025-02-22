import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiService } from './api.service';
import { LocalAuthGuard } from './guards/local.guard';
import { API_PATHS } from '@app/share';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RegisterBodyDto } from './dto/register-body.dto';
@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post(API_PATHS.REGISTER)
  register(@Body() body: RegisterBodyDto) {
    return this.apiService.register(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post(API_PATHS.LOGIN)
  login(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get(API_PATHS.VALIDATE)
  validateToken(@Request() req) {
    return req.user;
  }
}
