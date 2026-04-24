import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  Min,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { QuoteStatus } from '@prisma/client';

class QuoteItemUpdateDto {
  @IsString() productId: string;
  @IsOptional() @IsString() variantId?: string;
  @IsNumber() @Min(1) quantity: number;
  @IsNumber() @Min(0) unitPrice: number;
  @IsOptional() @IsNumber() @Min(0) discount?: number;
  @IsOptional() @IsString() notes?: string;
}

export class UpdateQuoteDto {
  @ApiPropertyOptional({ enum: QuoteStatus })
  @IsOptional()
  @IsEnum(QuoteStatus)
  status?: QuoteStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteItemUpdateDto)
  items?: QuoteItemUpdateDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  internalNotes?: string;

  @ApiPropertyOptional({ description: 'ISO date string' })
  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  salesRepId?: string;
}
