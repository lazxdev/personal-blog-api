export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  category?: string | null;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
  archivedAt?: Date | null;
};

export const PostStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus];

export type PostPublicationSnapshot = Pick<
  Post,
  'status' | 'publishedAt' | 'archivedAt'
>;

export type PostPublicationUpdate = {
  publishedAt?: Date | null;
  archivedAt?: Date | null;
};

export function isPostStatus(value: unknown): value is PostStatus {
  return Object.values(PostStatus).includes(value as PostStatus);
}

export function slugifyPostTitle(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function resolvePublicationOnCreate(
  status: PostStatus | undefined,
  now: Date = new Date(),
): PostPublicationUpdate {
  if (status === PostStatus.PUBLISHED) {
    return { publishedAt: now, archivedAt: null };
  }

  if (status === PostStatus.ARCHIVED) {
    return { archivedAt: now };
  }

  return {};
}

export function resolvePublicationOnStatusChange(
  currentPost: PostPublicationSnapshot,
  nextStatus: PostStatus | undefined,
  now: Date = new Date(),
): PostPublicationUpdate {
  if (!nextStatus) {
    return {};
  }

  if (nextStatus === PostStatus.PUBLISHED) {
    return {
      publishedAt: currentPost.publishedAt ?? now,
      archivedAt: null,
    };
  }

  if (nextStatus === PostStatus.DRAFT) {
    return {
      publishedAt: null,
      archivedAt: null,
    };
  }

  if (nextStatus === PostStatus.ARCHIVED) {
    return {
      archivedAt: currentPost.archivedAt ?? now,
    };
  }

  return {};
}
