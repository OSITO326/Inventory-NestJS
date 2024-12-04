import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  name: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía.' })
  description: string;

  @IsString({ message: 'La imagen debe ser un texto (URL o base64)' })
  @IsNotEmpty({ message: 'La imagen no puede estar vacía.' })
  image: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsNotEmpty({ message: 'El precio no puede estar vacío.' })
  price: number;

  @IsString({ message: 'El slug debe ser un texto' })
  @IsOptional()
  slug: string;

  @IsInt({ message: 'El stock debe ser un número entero' })
  @IsNotEmpty({ message: 'El stock no puede estar vacío.' })
  stock: number;

  @IsBoolean({
    message: 'El estado de disponibilidad debe ser verdadero o falso',
  })
  isAvailable: boolean;

  @IsString({ message: 'El sku debe ser un texto' })
  @IsOptional()
  sku: string;

  @IsString({ message: 'El ID de la marca debe ser un texto' })
  @IsNotEmpty({ message: 'El ID de la marca no puede estar vacío.' })
  trademarksId: string;

  @IsArray({ message: 'Las categorías deben ser un arreglo de IDs' })
  @ArrayNotEmpty({ message: 'El arreglo de categorías no puede estar vacío.' })
  @IsString({ each: true, message: 'Cada ID de categoría debe ser un texto' })
  categories: string[];
}
