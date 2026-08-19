import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AnthropicConfigService } from './config.service'
import AnthropicConfig from './configuration'

@Module({
  imports: [ConfigModule.forFeature(AnthropicConfig)],
  providers: [AnthropicConfigService],
  exports: [AnthropicConfigService],
})
export class AnthropicConfigModule {}
