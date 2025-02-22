
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { MICROSERVICE_KEYS, AUTH_COMMANDS } from '@app/share';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(MICROSERVICE_KEYS.AUTH) private readonly authClient: ClientProxy,
  ) {
    super();
  }

  validate(username: string, password: string): Observable<any> {
    const user = this.authClient.send({ cmd: AUTH_COMMANDS.VALIDATE_USER }, { username, password });
    if (!user) {
      throw new UnauthorizedException();
    }
    const token = this.authClient.send({ cmd: AUTH_COMMANDS.GENERATE_TOKEN }, { username });
    return token;
  }
}
