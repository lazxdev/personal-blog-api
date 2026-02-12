import { Post, PostStatus } from '../../../domain/model/post.entity';

export type CreatePostCommand = {
  title: string;
  content: string;
  tags: string[];
  category?: string;
  status?: PostStatus;
};

export type UpdatePostCommand = {
  title?: string;
  content?: string;
  tags?: string[];
  category?: string | null;
  status?: PostStatus;
};

export type ListPostsQuery = {
  category?: string;
  tag?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: PostStatus;
};

export type GetPostByIdQuery = {
  id: string;
};

export type GetPostBySlugQuery = {
  slug: string;
};

export type DeletePostCommand = {
  id: string;
};

export type ArchivePostCommand = {
  id: string;
};

export type PostResult = Post;
export type PostListResult = Post[];
