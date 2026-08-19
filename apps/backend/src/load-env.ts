import { config as loadEnv } from 'dotenv'

if (
  process.env.NODE_ENV !== 'production' &&
  process.env.NODE_ENV !== 'staging'
) {
  loadEnv({ path: './.env.development' })
}
