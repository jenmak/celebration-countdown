import { Injectable } from '@nestjs/common'
import { APP_NAME } from '@celebrationcountdown/shared'

@Injectable()
export class AppService {
  getHello(): { message: string } {
    return { message: `${APP_NAME} API` }
  }
}
