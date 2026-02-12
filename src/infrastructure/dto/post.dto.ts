import { PostStatus } from '../../domain/model/post.entity';

export type CreatePostDto = {
  title: string;
  content: string;
  tags: string[];
  category?: string;
  status?: PostStatus;
};

export type UpdatePostDto = {
  title?: string;
  content?: string;
  tags?: string[];
  category?: string | null;
  status?: PostStatus;
};

export type ListPostDto = {
  category?: string;
  tag?: string;
  status?: PostStatus;
  dateFrom?: string;
  dateTo?: string;
};
