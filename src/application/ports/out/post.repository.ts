import { Post } from '../../../domain/model/post.entity';
import {
  CreatePostData,
  PostFilters,
  UpdatePostData,
} from './post-repository.types';

export const POST_REPOSITORY = Symbol('POST_REPOSITORY');

export interface PostRepository {
  create(data: CreatePostData): Promise<Post>;
  findAll(filters?: PostFilters): Promise<Post[]>;
  findById(id: string): Promise<Post | null>;
  findBySlug(slug: string): Promise<Post | null>;
  update(id: string, data: UpdatePostData): Promise<Post>;
  delete(id: string): Promise<void>;
}
