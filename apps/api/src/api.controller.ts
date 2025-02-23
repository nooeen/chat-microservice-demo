import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiService } from './api.service';
import { API_PATHS } from '@app/share';
import { RegisterBodyDto } from './dto/register-body.dto';
import { LocalAuthGuard } from '@app/share/guards/local.guard';
import { JwtAuthGuard } from '@app/share/guards/jwt.guard';
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
