import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { POST_USE_CASE } from '../../application/ports/in/post-use-case.port';
import type { PostUseCasePort } from '../../application/ports/in/post-use-case.port';
import { isPostStatus } from '../../domain/model/post.entity';
import type {
  CreatePostDto,
  UpdatePostDto,
  ListPostDto,
} from '../dto/post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    @Inject(POST_USE_CASE)
    private readonly postsUseCase: PostUseCasePort,
  ) {}

  @Post()
  async create(@Body() body: CreatePostDto) {
    this.validatePostStatus(body.status);

    return this.postsUseCase.create({
      title: body.title,
      content: body.content,
      tags: body.tags ?? [],
      category: body.category,
      status: body.status,
    });
  }

  @Get()
  async list(@Query() query: ListPostDto) {
    this.validatePostStatus(query.status);

    return this.postsUseCase.list({
      category: query.category,
      tag: query.tag,
      status: query.status,
      dateFrom: this.parseDate(query.dateFrom, 'dateFrom'),
      dateTo: this.parseDate(query.dateTo, 'dateTo'),
    });
  }

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.postsUseCase.getBySlug({ slug });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.postsUseCase.getById({ id });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdatePostDto) {
    this.validatePostStatus(body.status);

    return this.postsUseCase.update(id, {
      title: body.title,
      content: body.content,
      tags: body.tags,
      category: body.category,
      status: body.status,
    });
  }

  @Patch(':id/archive')
  async archive(@Param('id') id: string) {
    return this.postsUseCase.archive({ id });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.postsUseCase.delete({ id });
    return { success: true };
  }

  private parseDate(
    value: string | undefined,
    field: string,
  ): Date | undefined {
    if (!value) {
      return undefined;
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new BadRequestException(`Invalid date for ${field}`);
    }

    return parsedDate;
  }

  private validatePostStatus(status: unknown): void {
    if (!status) {
      return;
    }

    if (!isPostStatus(status)) {
      throw new BadRequestException('Invalid post status');
    }
  }
}
