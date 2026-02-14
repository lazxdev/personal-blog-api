import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

const MONGO_OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPostDto: CreatePostDto): Promise<Post> {
    return this.prisma.post.create({
      data: {
        title: createPostDto.title,
        slug: createPostDto.slug,
        excerpt: createPostDto.excerpt,
        content: createPostDto.content,
        published: createPostDto.published ?? false,
      },
    });
  }

  findAll(): Promise<Post[]> {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Post> {
    this.ensureValidObjectId(id);

    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    this.ensureValidObjectId(id);

    try {
      return await this.prisma.post.update({
        where: { id },
        data: {
          title: updatePostDto.title,
          slug: updatePostDto.slug,
          excerpt: updatePostDto.excerpt,
          content: updatePostDto.content,
          published: updatePostDto.published,
        },
      });
    } catch (error: unknown) {
      this.handlePrismaError(error, id);
      throw error;
    }
  }

  async remove(id: string): Promise<Post> {
    this.ensureValidObjectId(id);

    try {
      return await this.prisma.post.delete({ where: { id } });
    } catch (error: unknown) {
      this.handlePrismaError(error, id);
      throw error;
    }
  }

  private ensureValidObjectId(id: string): void {
    if (!MONGO_OBJECT_ID_REGEX.test(id)) {
      throw new BadRequestException(`Invalid Mongo ObjectId: ${id}`);
    }
  }

  private handlePrismaError(error: unknown, id: string): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }
}
