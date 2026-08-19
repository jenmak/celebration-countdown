import JoiUtil, { JoiConfig } from '@common/utils/joi-util'
import { registerAs } from '@nestjs/config'
import * as Joi from 'joi'

interface ICognitoConfig {
  userPoolId: string
  clientId: string
}

export default registerAs('cognito', (): ICognitoConfig => {
  const configs: JoiConfig<ICognitoConfig> = {
    userPoolId: {
      value: process.env.COGNITO_USER_POOL_ID,
      joi: Joi.string().min(1).required(),
    },
    clientId: {
      value: process.env.COGNITO_CLIENT_ID,
      joi: Joi.string().min(1).required(),
    },
  }

  return JoiUtil.validate(configs)
})
