
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { MICROSERVICE_KEYS, AUTH_COMMANDS } from '@app/share';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(MICROSERVICE_KEYS.AUTH) private readonly authClient: ClientProxy,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authClient.send({ cmd: AUTH_COMMANDS.VALIDATE_USER }, { username, password });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
