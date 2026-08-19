import { AWSConfigModule } from '@config/aws/config.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { S3ConfigService } from './config.service'
import S3Config from './configuration'

@Module({
  imports: [AWSConfigModule, ConfigModule.forFeature(S3Config)],
  providers: [S3ConfigService],
  exports: [S3ConfigService],
})
export class S3ConfigModule {}
