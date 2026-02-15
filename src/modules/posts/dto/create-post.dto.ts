import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Cómo configurar NestJS con Prisma' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(120)
  title!: string;

  @ApiProperty({ example: 'como-configurar-nestjs-con-prisma' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase and use hyphens only',
  })
  slug!: string;

  @ApiProperty({
    example:
      'En este post te explico paso a paso como integrar NestJS con Prisma y MongoDB para una API robusta.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  content!: string;

  @ApiPropertyOptional({ example: 'Guía rápida para usar NestJS + Prisma.' })
  @IsOptional()
  @IsString()
  @MaxLength(240)
  excerpt?: string;
}
