import { AWSConfigModule } from '@config/aws/config.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CognitoConfigService } from './config.service'
import CognitoConfig from './configuration'

@Module({
  imports: [AWSConfigModule, ConfigModule.forFeature(CognitoConfig)],
  providers: [CognitoConfigService],
  exports: [CognitoConfigService],
})
export class CognitoConfigModule {}
