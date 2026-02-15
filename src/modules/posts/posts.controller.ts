import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un post' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los posts' })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un post por id' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un post' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Patch(':id/toggle-published')
  @ApiOperation({ summary: 'Alternar estado de publicación del post' })
  togglePublished(@Param('id') id: string) {
    return this.postsService.togglePublished(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un post' })
  @ApiParam({ name: 'id', description: 'Mongo ObjectId del post' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
