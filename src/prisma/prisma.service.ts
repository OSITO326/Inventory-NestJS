import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Inventory Database');
  async onModuleInit() {
    console.log('DB connect');
    await this.$connect();
    this.logger.log('Inventory Database connected');
  }
}
