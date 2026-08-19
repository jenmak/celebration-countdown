import { Module } from '@nestjs/common'
import { AnthropicModule } from '@providers/anthropic/anthropic.module'
import { MediaModule } from '@providers/media/media.module'
import { AuthModule } from '../auth/auth.module'
import { ContactController } from './contact.controller'
import { ContactService } from './contact.service'

@Module({
  imports: [AuthModule, AnthropicModule, MediaModule],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
