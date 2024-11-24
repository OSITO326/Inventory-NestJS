import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBrandDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre de la marca no puede estar vacío.' })
  name: string;
  @IsString()
  @IsOptional()
  slug: string;
}
