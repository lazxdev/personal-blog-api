import { PostStatus } from '../../../domain/model/post.entity';

export type PostFilters = {
  category?: string;
  tag?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: PostStatus;
};

export type CreatePostData = {
  title: string;
  slug: string;
  content: string;
  tags: string[];
  category?: string | null;
  status?: PostStatus;
  publishedAt?: Date | null;
  archivedAt?: Date | null;
};

export type UpdatePostData = {
  title?: string;
  slug?: string;
  content?: string;
  tags?: string[];
  category?: string | null;
  status?: PostStatus;
  publishedAt?: Date | null;
  archivedAt?: Date | null;
};
