import { Inject, Injectable } from '@nestjs/common';
import { PostUseCasePort } from '../ports/in/post-use-case.port';
import {
  ArchivePostCommand,
  CreatePostCommand,
  DeletePostCommand,
  GetPostByIdQuery,
  GetPostBySlugQuery,
  ListPostsQuery,
  PostListResult,
  PostResult,
  UpdatePostCommand,
} from '../ports/in/post-use-case.types';
import { POST_REPOSITORY } from '../ports/out/post.repository';
import type { PostRepository } from '../ports/out/post.repository';
import {
  PostStatus,
  resolvePublicationOnCreate,
  resolvePublicationOnStatusChange,
  slugifyPostTitle,
} from '../../domain/model/post.entity';

@Injectable()
export class PostsService implements PostUseCasePort {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
  ) {}

  async create(command: CreatePostCommand): Promise<PostResult> {
    const slug = await this.buildUniqueSlugFromTitle(command.title);
    const publicationData = resolvePublicationOnCreate(command.status);

    return this.postRepository.create({
      title: command.title,
      slug,
      content: command.content,
      tags: command.tags,
      category: command.category,
      status: command.status,
      ...publicationData,
    });
  }

  async list(query?: ListPostsQuery): Promise<PostListResult> {
    return this.postRepository.findAll(query);
  }

  async getById(query: GetPostByIdQuery): Promise<PostResult | null> {
    return this.postRepository.findById(query.id);
  }

  async getBySlug(query: GetPostBySlugQuery): Promise<PostResult | null> {
    return this.postRepository.findBySlug(query.slug);
  }

  async update(id: string, command: UpdatePostCommand): Promise<PostResult> {
    const currentPost =
      command.title || command.status
        ? await this.postRepository.findById(id)
        : null;

    const updateData = {
      title: command.title,
      content: command.content,
      tags: command.tags,
      category: command.category,
      status: command.status,
      ...resolvePublicationOnStatusChange(
        currentPost ?? {
          status: command.status ?? PostStatus.DRAFT,
          publishedAt: undefined,
          archivedAt: undefined,
        },
        command.status,
      ),
    };

    if (!command.title || !currentPost) {
      return this.postRepository.update(id, updateData);
    }

    if (currentPost.title === command.title) {
      return this.postRepository.update(id, updateData);
    }

    const slug = await this.buildUniqueSlugFromTitle(command.title, id);

    return this.postRepository.update(id, {
      ...updateData,
      slug,
    });
  }

  async delete(command: DeletePostCommand): Promise<void> {
    await this.postRepository.delete(command.id);
  }

  async archive(command: ArchivePostCommand): Promise<PostResult> {
    const currentPost = await this.postRepository.findById(command.id);

    return this.postRepository.update(command.id, {
      status: PostStatus.ARCHIVED,
      ...resolvePublicationOnStatusChange(
        currentPost ?? {
          status: PostStatus.ARCHIVED,
          publishedAt: undefined,
          archivedAt: undefined,
        },
        PostStatus.ARCHIVED,
      ),
    });
  }

  private async buildUniqueSlugFromTitle(
    title: string,
    currentPostId?: string,
  ): Promise<string> {
    const baseSlug = this.slugify(title);
    let attempt = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.postRepository.findBySlug(attempt);
      if (!existing || existing.id === currentPostId) {
        return attempt;
      }
      counter += 1;
      attempt = `${baseSlug}-${counter}`;
    }
  }

  private slugify(value: string): string {
    return slugifyPostTitle(value);
  }
}
