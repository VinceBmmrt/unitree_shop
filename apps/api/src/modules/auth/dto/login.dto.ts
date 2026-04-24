import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase?.().trim())
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  password: string;
}
