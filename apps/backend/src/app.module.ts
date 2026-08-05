import { AppConfigModule } from '@config/app/config.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from '@providers/prisma/prisma.module'
import { HealthModule } from './api/health/health.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

const CONFIG_MODULES = [AppConfigModule]
const API_MODULES = [HealthModule]

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
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        explicitConnect: true,
      },
    }),
    ...CONFIG_MODULES,
    ...API_MODULES,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
