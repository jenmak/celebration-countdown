import { AWSConfigModule } from '@config/aws/config.module'
import { CognitoConfigModule } from '@config/cognito/config.module'
import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LocalUserGuard } from './guards/cognito-auth.guard'

@Module({
  imports: [AWSConfigModule, CognitoConfigModule],
  controllers: [AuthController],
  providers: [AuthService, LocalUserGuard],
  exports: [AuthService, LocalUserGuard],
})
export class AuthModule {}
