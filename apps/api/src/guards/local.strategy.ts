
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { MICROSERVICE_KEYS, AUTH_COMMANDS } from '@app/share';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(MICROSERVICE_KEYS.AUTH) private readonly authClient: ClientProxy,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await firstValueFrom(this.authClient.send({ cmd: AUTH_COMMANDS.VALIDATE_USER }, { username, password }));
    
    if (user.statusCode !== 200) {
      throw new UnauthorizedException(user.message);
    }
    
    const token = await firstValueFrom(this.authClient.send({ cmd: AUTH_COMMANDS.GENERATE_TOKEN }, { username }));
    return token;
  }
}
