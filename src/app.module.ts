import { Module } from '@nestjs/common';
import { PostsModule } from './modules/posts/posts.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [PostsModule, HealthModule],
})
export class AppModule {}
