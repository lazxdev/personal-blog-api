import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrismaRepository {
  constructor(protected readonly prisma: PrismaService) {}
}
