import JoiUtil, { JoiConfig } from '@common/utils/joi-util'
import { registerAs } from '@nestjs/config'
import * as Joi from 'joi'

interface IAnthropicConfig {
  apiKey: string
  model: string
}

export default registerAs('anthropic', (): IAnthropicConfig => {
  const configs: JoiConfig<IAnthropicConfig> = {
    apiKey: {
      value: process.env.ANTHROPIC_API_KEY || '',
      joi: Joi.string().allow('').required(),
    },
    model: {
      value: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
      joi: Joi.string().required(),
    },
  }

  return JoiUtil.validate(configs)
})
