import { Module } from '@nestjs/common';
import { ConfigurationModule } from './modules/configuration/configuration.module';
@Module({
  imports: [ConfigurationModule],
  exports: [],
})
export class ShareModule {}
