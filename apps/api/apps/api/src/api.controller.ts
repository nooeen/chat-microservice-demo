import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiService } from './api.service';
import { API_PATHS } from '@app/share';
import { RegisterBodyDto } from './dto/register-body.dto';
import { LocalAuthGuard } from 'apps/api/src/guards/local.guard';
import { JwtAuthGuard } from 'apps/api/src/guards/jwt.guard';
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

  @UseGuards(JwtAuthGuard)
  @Get(API_PATHS.GET_RECENT_CONVERSATIONS)
  getRecentConversations(@Request() req) {
    return this.apiService.getRecentConversations(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get(API_PATHS.GET_CONVERSATION)
  getConversation(@Request() req, @Query('username') username: string) {
    return this.apiService.getConversation(req.user.username, username);
  }
}
