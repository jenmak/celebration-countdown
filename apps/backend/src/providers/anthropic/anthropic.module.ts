import { Module } from '@nestjs/common'
import { AnthropicConfigModule } from '@config/anthropic/config.module'
import { AnthropicService } from './anthropic.service'

@Module({
  imports: [AnthropicConfigModule],
  providers: [AnthropicService],
  exports: [AnthropicService],
})
export class AnthropicModule {}
