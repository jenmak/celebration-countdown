import { AWSConfigModule } from '@config/aws/config.module'
import { S3ConfigModule } from '@config/storage/config.module'
import { Module } from '@nestjs/common'
import { MediaService } from './media.service'

@Module({
  imports: [AWSConfigModule, S3ConfigModule],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
