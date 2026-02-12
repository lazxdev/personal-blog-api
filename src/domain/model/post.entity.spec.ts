import {
  PostStatus,
  isPostStatus,
  resolvePublicationOnCreate,
  resolvePublicationOnStatusChange,
  slugifyPostTitle,
} from './post.entity';

describe('Post domain rules', () => {
  it('slugifies title using normalized lowercase value', () => {
    expect(slugifyPostTitle('Hola, Mundo Ágil!')).toBe('hola-mundo-agil');
  });

  it('validates post status type guard', () => {
    expect(isPostStatus(PostStatus.DRAFT)).toBe(true);
    expect(isPostStatus('UNKNOWN')).toBe(false);
  });

  it('sets publishedAt for published posts on create', () => {
    const now = new Date('2026-02-12T10:00:00.000Z');
    const result = resolvePublicationOnCreate(PostStatus.PUBLISHED, now);

    expect(result).toEqual({
      publishedAt: now,
      archivedAt: null,
    });
  });

  it('resets publication fields when moving to draft', () => {
    const currentPost = {
      status: PostStatus.PUBLISHED,
      publishedAt: new Date('2026-02-10T10:00:00.000Z'),
      archivedAt: null,
    };

    expect(
      resolvePublicationOnStatusChange(currentPost, PostStatus.DRAFT),
    ).toEqual({
      publishedAt: null,
      archivedAt: null,
    });
  });

  it('sets archivedAt once when moving to archived', () => {
    const now = new Date('2026-02-12T10:00:00.000Z');
    const currentPost = {
      status: PostStatus.PUBLISHED,
      publishedAt: new Date('2026-02-10T10:00:00.000Z'),
      archivedAt: null,
    };

    expect(
      resolvePublicationOnStatusChange(currentPost, PostStatus.ARCHIVED, now),
    ).toEqual({
      archivedAt: now,
    });
  });
});
