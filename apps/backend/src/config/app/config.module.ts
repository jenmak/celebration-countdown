import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppConfigService } from './config.service'
import AppConfig from './configuration'

@Module({
  imports: [ConfigModule.forFeature(AppConfig)],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
