import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_COMMANDS, MICROSERVICE_KEYS } from '@app/share';
import { RegisterBodyDto } from './dto/register-body.dto';
@Injectable()
export class ApiService {
  constructor(
    @Inject(MICROSERVICE_KEYS.AUTH) private readonly authClient: ClientProxy,
  ) {}

  register(body: RegisterBodyDto) {
    try {
      return this.authClient.send({ cmd: AUTH_COMMANDS.REGISTER }, body);
    } catch (error) {
      throw new error;
    }
  }

}
