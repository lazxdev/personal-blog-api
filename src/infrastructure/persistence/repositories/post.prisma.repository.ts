import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PostRepository } from '../../../application/ports/out/post.repository';
import {
  CreatePostData,
  PostFilters,
  UpdatePostData,
} from '../../../application/ports/out/post-repository.types';
import { Post } from '../../../domain/model/post.entity';
import { PrismaRepository } from './prisma.repository';

@Injectable()
export class PrismaPostRepository
  extends PrismaRepository
  implements PostRepository
{
  async create(data: CreatePostData): Promise<Post> {
    const createData: Prisma.PostCreateInput = {
      title: data.title,
      slug: data.slug,
      content: data.content,
      tags: data.tags,
      category: data.category,
      status: data.status,
      publishedAt: data.publishedAt,
      archivedAt: data.archivedAt,
    };

    return this.prisma.post.create({ data: createData });
  }

  async findAll(filters?: PostFilters): Promise<Post[]> {
    const where: Prisma.PostWhereInput = {};

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.tag) {
      where.tags = { has: filters.tag };
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      const dateFilter: Prisma.DateTimeFilter = {};
      if (filters?.dateFrom) {
        dateFilter.gte = filters.dateFrom;
      }
      if (filters?.dateTo) {
        dateFilter.lte = filters.dateTo;
      }
      where.createdAt = dateFilter;
    }

    return this.prisma.post.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { slug } });
  }

  async update(id: string, data: UpdatePostData): Promise<Post> {
    const updateData: Prisma.PostUpdateInput = {
      title: data.title,
      slug: data.slug,
      content: data.content,
      tags: data.tags,
      category: data.category,
      status: data.status,
      publishedAt: data.publishedAt,
      archivedAt: data.archivedAt,
    };

    return this.prisma.post.update({ where: { id }, data: updateData });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.post.delete({ where: { id } });
  }
}
