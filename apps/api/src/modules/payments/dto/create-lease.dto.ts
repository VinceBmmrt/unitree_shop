import { IsNumber, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaseDto {
  @ApiProperty({ description: 'Lease term in months', example: 36 })
  @IsNumber()
  @IsEnum([12, 24, 36, 48, 60])
  termMonths: 12 | 24 | 36 | 48 | 60;

  @ApiProperty({ description: 'Annual interest rate as a percentage', example: 8.5 })
  @IsNumber()
  @Min(0)
  @Max(30)
  annualRate: number;
}
