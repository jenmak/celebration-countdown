import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@celebrationcountdown/orm/dist/generated/client'
import { Injectable, OnModuleInit } from '@nestjs/common'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    })
    super({ adapter })
  }

  async onModuleInit() {
    await this.$connect()
  }
}
