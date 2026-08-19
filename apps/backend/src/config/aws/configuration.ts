import JoiUtil, { JoiConfig } from '@common/utils/joi-util'
import { registerAs } from '@nestjs/config'
import * as Joi from 'joi'

interface IAWSConfig {
  region: string
  accessKey: string
  secret: string
}

export default registerAs('aws', (): IAWSConfig => {
  const configs: JoiConfig<IAWSConfig> = {
    region: {
      value: process.env.AWS_REGION,
      joi: Joi.string().required(),
    },
    accessKey: {
      value: process.env.AWS_ACCESS_KEY,
      joi: Joi.string().min(1).required(),
    },
    secret: {
      value: process.env.AWS_SECRET,
      joi: Joi.string().min(1).required(),
    },
  }

  return JoiUtil.validate(configs)
})
