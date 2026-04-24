import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
  ValidateNested,
  IsBoolean,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QuoteItemRequestDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateQuoteRequestDto {
  // Contact info — collected on the form (user may not be logged in initially)
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName: string;

  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase?.().trim())
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  // What they want
  @ApiProperty({ type: [QuoteItemRequestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteItemRequestDto)
  items: QuoteItemRequestDto[];

  // Context — helps sales rep prepare
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  useCase?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  timeline?: string;

  @ApiPropertyOptional({ description: 'Approximate budget in EUR' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @ApiPropertyOptional({ description: 'Request financing/leasing option' })
  @IsOptional()
  @IsBoolean()
  requestsFinancing?: boolean;

  @ApiPropertyOptional({ enum: ['email', 'phone', 'visio'] })
  @IsOptional()
  @IsEnum(['email', 'phone', 'visio'])
  preferredContact?: 'email' | 'phone' | 'visio';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  additionalNotes?: string;

  // GDPR consent — required field
  @ApiProperty({ description: 'User confirms they have read the privacy policy' })
  @IsBoolean()
  gdprConsent: boolean;
}
