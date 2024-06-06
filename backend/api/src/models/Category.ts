import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  category_name: string;

  @ApiProperty()
  @IsNotEmpty()
  created_at: string;

  @ApiProperty()
  @IsNotEmpty()
  updated_at: string;

  constructor(category: CategoryDto) {
    Object.assign(this, category);
  }
}
