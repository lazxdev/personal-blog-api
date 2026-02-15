import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePostDto implements Partial<CreatePostDto> {
  @ApiPropertyOptional({ example: 'Título actualizado del post' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title?: string;

  @ApiPropertyOptional({ example: 'titulo-actualizado-del-post' })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase and use hyphens only',
  })
  slug?: string;

  @ApiPropertyOptional({
    example:
      'Contenido actualizado del post con una explicación más completa y ejemplos.',
  })
  @IsOptional()
  @IsString()
  @MinLength(20)
  content?: string;

  @ApiPropertyOptional({ example: 'Resumen actualizado del post.' })
  @IsOptional()
  @IsString()
  @MaxLength(240)
  excerpt?: string;
}
