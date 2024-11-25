import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertToSlug } from 'src/common/helpers/convert-to-slug';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const { name } = createCategoryDto;
      const categoryExist = await this.prisma.categories.findFirst({
        where: {
          name,
        },
      });

      if (categoryExist) {
        throw new BadRequestException(
          'Category with that name has already been registered',
        );
      }

      const slug = convertToSlug(name);
      const category = await this.prisma.categories.create({
        data: {
          ...createCategoryDto,
          slug,
        },
      });

      return {
        message: 'Category created successfully',
        category,
      };
    } catch (error) {
      throw new BadRequestException({
        message: 'An error occurred',
        error,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findAll() {
    try {
      const category = await this.prisma.categories.findMany();

      return {
        category,
      };
    } catch (error) {
      throw new BadRequestException({
        message: 'An error occurred',
        error,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findOne(term: string) {
    try {
      const category = await this.prisma.categories.findFirst({
        where: {
          OR: [{ id: term }, { slug: term }],
        },
      });

      if (!category) {
        throw new NotFoundException('Not found category');
      }

      return {
        category,
      };
    } catch (error) {
      throw new BadRequestException({
        message: 'An error occurred',
        error,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const { name } = updateCategoryDto;
      const categoryExist = await this.prisma.categories.findFirst({
        where: {
          id,
        },
      });

      if (!categoryExist) {
        throw new NotFoundException('Category not found');
      }

      if (name) {
        const slug = convertToSlug(name);
        const category = await this.prisma.categories.update({
          where: {
            id,
          },
          data: {
            ...updateCategoryDto,
            slug,
          },
        });

        return {
          message: 'Category updated',
          category,
        };
      }

      const category = await this.prisma.categories.update({
        where: {
          id,
        },
        data: updateCategoryDto,
      });

      return {
        message: 'Category updated',
        category,
      };
    } catch (error) {
      throw new BadRequestException({
        message: 'An error occurred',
        error,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }

  async remove(id: string) {
    try {
      const categoryExist = await this.prisma.categories.findFirst({
        where: {
          id,
        },
      });

      if (!categoryExist) {
        throw new NotFoundException('Category not found');
      }

      const deleteCategory = await this.prisma.categories.delete({
        where: {
          id,
        },
      });

      return {
        message: 'Category deleted',
        deleteCategory,
      };
    } catch (error) {
      throw new BadRequestException({
        message: 'An error occurred',
        error,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }
}
