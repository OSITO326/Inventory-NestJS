import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre de la categoria no puede estar vacío.' })
  name: string;
  @IsString()
  @IsOptional()
  slug: string;
}
