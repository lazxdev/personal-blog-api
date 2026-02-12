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
} from './post-use-case.types';

export const POST_USE_CASE = Symbol('POST_USE_CASE');

export interface PostUseCasePort {
  create(command: CreatePostCommand): Promise<PostResult>;
  list(query?: ListPostsQuery): Promise<PostListResult>;
  getById(query: GetPostByIdQuery): Promise<PostResult | null>;
  getBySlug(query: GetPostBySlugQuery): Promise<PostResult | null>;
  update(id: string, command: UpdatePostCommand): Promise<PostResult>;
  delete(command: DeletePostCommand): Promise<void>;
  archive(command: ArchivePostCommand): Promise<PostResult>;
}
