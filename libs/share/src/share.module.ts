import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration/configuration.module';
@Module({
  imports: [ConfigurationModule],
  exports: [],
})
export class ShareModule {}
