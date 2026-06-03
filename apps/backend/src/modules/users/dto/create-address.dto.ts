import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiPropertyOptional({ example: 'Domicile' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  label?: string;

  @ApiProperty({ example: 'Jean' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @ApiProperty({ example: 'Dupont' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @ApiPropertyOptional({ example: 'Acme SA' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  company?: string;

  @ApiProperty({ example: '42 rue de la Paix' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @Transform(({ value }) => value?.trim())
  line1: string;

  @ApiPropertyOptional({ example: 'Bâtiment B' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Transform(({ value }) => value?.trim())
  line2?: string;

  @ApiProperty({ example: 'Paris' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  city: string;

  @ApiPropertyOptional({ example: 'Île-de-France' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  state?: string;

  @ApiProperty({ example: '75001' })
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  @Transform(({ value }) => value?.trim())
  postalCode: string;

  @ApiProperty({ example: 'FR' })
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  @Transform(({ value }) => (value?.trim() ?? 'FR').toUpperCase())
  country: string;

  @ApiPropertyOptional({ example: '+33612345678' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Transform(({ value }) => value?.trim())
  phone?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
