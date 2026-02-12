import { Module } from '@nestjs/common';
import { POST_USE_CASE } from './application/ports/in/post-use-case.port';
import { PostsService } from './application/services/posts.service';
import { PostsController } from './infrastructure/controller/posts.controller';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [PrismaModule, PersistenceModule],
  controllers: [PostsController],
  providers: [
    PostsService,
    {
      provide: POST_USE_CASE,
      useExisting: PostsService,
    },
  ],
})
export class AppModule {}
