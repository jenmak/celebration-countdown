import JoiUtil, { JoiConfig } from '@common/utils/joi-util'
import { registerAs } from '@nestjs/config'
import * as Joi from 'joi'

interface IS3Config {
  bucket: string
}

export default registerAs('s3', (): IS3Config => {
  const configs: JoiConfig<IS3Config> = {
    bucket: {
      value: process.env.S3_BUCKET,
      joi: Joi.string().min(1).required(),
    },
  }

  return JoiUtil.validate(configs)
})
