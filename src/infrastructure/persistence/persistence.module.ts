import { Module } from '@nestjs/common';
import { POST_REPOSITORY } from '../../application/ports/out/post.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaRepository } from './repositories/prisma.repository';
import { PrismaPostRepository } from './repositories/post.prisma.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaRepository,
    PrismaPostRepository,
    {
      provide: POST_REPOSITORY,
      useExisting: PrismaPostRepository,
    },
  ],
  exports: [PrismaRepository, PrismaPostRepository, POST_REPOSITORY],
})
export class PersistenceModule {}
