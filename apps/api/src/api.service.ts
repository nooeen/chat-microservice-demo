import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_COMMANDS, MICROSERVICE_KEYS } from '@app/share';
@Injectable()
export class ApiService {
  constructor(
    @Inject(MICROSERVICE_KEYS.AUTH) private readonly authClient: ClientProxy,
  ) {}

  async login(body: { username: string }) {
    return this.authClient.send({ cmd: AUTH_COMMANDS.GENERATE_TOKEN }, body);
  }

  async register(body: { username: string; password: string }) {
    return this.authClient.send({ cmd: AUTH_COMMANDS.REGISTER }, body);
  }

  async validateToken(body: { token: string }) {
    return this.authClient.send({ cmd: AUTH_COMMANDS.VALIDATE_TOKEN }, body);
  }
}
