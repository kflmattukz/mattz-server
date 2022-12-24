import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://mattz:doraemon08@localhost:5432/mattz_code?schema=public',
        },
      },
    });
  }
}
