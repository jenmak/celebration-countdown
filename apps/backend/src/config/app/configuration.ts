import JoiUtil, { JoiConfig } from '@common/utils/joi-util'
import { registerAs } from '@nestjs/config'
import * as Joi from 'joi'

interface IAppConfig {
  nodeEnv: string
  port: number
}

export default registerAs('app', (): IAppConfig => {
  const configs: JoiConfig<IAppConfig> = {
    nodeEnv: {
      value: process.env.NODE_ENV || 'development',
      joi: Joi.string().valid('development', 'staging', 'production'),
    },
    port: {
      value: parseInt(process.env.PORT) || 3001,
      joi: Joi.number(),
    },
  }

  return JoiUtil.validate(configs)
})
