import { ExcludeNullInterceptor } from '@common/interceptors/exclude-null.interceptor'
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor'
import { TransformationInterceptor } from '@common/interceptors/transformation.interceptor'
import { AnthropicConfigModule } from '@config/anthropic/config.module'
import { AppConfigModule } from '@config/app/config.module'
import { AWSConfigModule } from '@config/aws/config.module'
import { CognitoConfigModule } from '@config/cognito/config.module'
import { CognitoConfigService } from '@config/cognito/config.service'
import { S3ConfigModule } from '@config/storage/config.module'
import { CognitoAuthModule } from '@nestjs-cognito/auth'
import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { MediaModule } from '@providers/media/media.module'
import { PrismaModule } from '@providers/prisma/prisma.module'
import { AuthModule } from './api/auth/auth.module'
import { ContactModule } from './api/contact/contact.module'
import { WishlistModule } from './api/wishlist/wishlist.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

const CONFIG_MODULES = [
  AppConfigModule,
  AWSConfigModule,
  CognitoConfigModule,
  S3ConfigModule,
  AnthropicConfigModule,
]

const API_MODULES = [AuthModule, ContactModule, WishlistModule]

const INTERCEPTORS = [
  LoggingInterceptor,
  ExcludeNullInterceptor,
  TransformationInterceptor,
  ClassSerializerInterceptor,
]

function arrayToProviders(provide, classes) {
  return classes.reduce((acc, useClass) => {
    return [
      ...acc,
      {
        provide,
        useClass,
      },
    ]
  }, [])
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production' ||
        process.env.NODE_ENV === 'staging'
          ? './.env'
          : './.env.development',
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    CognitoAuthModule.registerAsync({
      imports: [CognitoConfigModule],
      inject: [CognitoConfigService],
      useFactory: (cognitoConfig: CognitoConfigService) => ({
        jwtVerifier: {
          userPoolId: cognitoConfig.userPoolId,
          clientId: cognitoConfig.clientId,
          tokenUse: 'access',
        },
      }),
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        explicitConnect: true,
      },
    }),
    MediaModule,
    ...CONFIG_MODULES,
    ...API_MODULES,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ...arrayToProviders(APP_INTERCEPTOR, INTERCEPTORS),
  ],
})
export class AppModule {}
