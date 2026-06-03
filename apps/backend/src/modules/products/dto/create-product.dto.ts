import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  Min,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductCategory } from '@prisma/client';

class ProductImageDto {
  @IsString() url: string;
  @IsOptional() @IsString() altText?: string;
  @IsOptional() @IsBoolean() isPrimary?: boolean;
  @IsOptional() @IsNumber() sortOrder?: number;
}

export class CreateProductDto {
  @ApiProperty() @IsString() sku: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() slug: string;

  @ApiPropertyOptional() @IsOptional() @IsString() shortDescription?: string;
  @ApiProperty() @IsString() description: string;

  @ApiProperty({ enum: ProductCategory })
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiProperty() @IsNumber() @Min(0) basePrice: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) compareAtPrice?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) leasePriceMonth?: number;

  @ApiPropertyOptional() @IsOptional() @IsObject() specifications?: Record<string, any>;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isConfigurable?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requiresQuote?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() taxCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() weight?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() dimensions?: Record<string, any>;
  @ApiPropertyOptional() @IsOptional() @IsString() modelUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() modelFormat?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() videoUrl?: string;

  @ApiPropertyOptional({ type: [ProductImageDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
