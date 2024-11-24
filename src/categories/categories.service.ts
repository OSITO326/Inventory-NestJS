import {
  BadRequestException,
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
  }

  async findAll() {
    const category = await this.prisma.categories.findMany();

    return {
      category,
    };
  }

  async findOne(term: string) {
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
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
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
  }

  async remove(id: string) {
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
  }
}
