import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../../../libs/share/src/guards/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS, ShareModule } from '@app/share';
import { UsersModule } from '@app/users';
import { LocalStrategy } from '../../../libs/share/src/guards/local.strategy';

@Module({
  imports: [
    ShareModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const jwtConfig = configService.get(CONFIG_KEYS.JWT);
        return {
          global: true,
          secret: jwtConfig.secret,
          signOptions: { expiresIn: jwtConfig.expiresIn },
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {} 