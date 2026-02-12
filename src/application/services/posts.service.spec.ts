import { PostsService } from './posts.service';
import { PostStatus, type Post } from '../../domain/model/post.entity';
import type { PostRepository } from '../ports/out/post.repository';

function buildPost(overrides: Partial<Post> = {}): Post {
  const now = new Date('2026-02-12T10:00:00.000Z');

  return {
    id: 'post-1',
    title: 'Test Post',
    slug: 'test-post',
    content: 'content',
    tags: ['tag'],
    category: 'backend',
    status: PostStatus.DRAFT,
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
    archivedAt: null,
    ...overrides,
  };
}

describe('PostsService', () => {
  function createRepositoryMock(): jest.Mocked<PostRepository> {
    return {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  }

  it('creates post with unique slug when collision exists', async () => {
    const repository = createRepositoryMock();
    repository.findBySlug
      .mockResolvedValueOnce(buildPost())
      .mockResolvedValueOnce(null);
    repository.create.mockImplementation((data) =>
      Promise.resolve(buildPost(data)),
    );

    const service = new PostsService(repository);
    const result = await service.create({
      title: 'Test Post',
      content: 'body',
      tags: [],
      status: PostStatus.DRAFT,
    });

    expect(repository.create.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({ slug: 'test-post-2' }),
    );
    expect(result.slug).toBe('test-post-2');
  });

  it('archives a post by updating status and archivedAt', async () => {
    const repository = createRepositoryMock();
    repository.findById.mockResolvedValueOnce(buildPost());
    repository.update.mockImplementation((_id, data) =>
      Promise.resolve(
        buildPost({
          status: data.status ?? PostStatus.DRAFT,
          archivedAt: data.archivedAt ?? null,
        }),
      ),
    );

    const service = new PostsService(repository);
    const result = await service.archive({ id: 'post-1' });

    expect(repository.update.mock.calls[0]).toEqual([
      'post-1',
      expect.objectContaining({ status: PostStatus.ARCHIVED }),
    ]);
    expect(result.status).toBe(PostStatus.ARCHIVED);
    expect(result.archivedAt).toBeInstanceOf(Date);
  });
});
