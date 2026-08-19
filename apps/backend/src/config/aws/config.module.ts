import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AWSConfigService } from './config.service'
import AWSConfig from './configuration'

@Module({
  imports: [ConfigModule.forFeature(AWSConfig)],
  providers: [AWSConfigService],
  exports: [AWSConfigService],
})
export class AWSConfigModule {}
