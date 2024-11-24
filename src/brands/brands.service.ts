import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertToSlug } from 'src/common/helpers/convert-to-slug';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto) {
    const { name } = createBrandDto;
    const brandExist = await this.prisma.brands.findFirst({
      where: {
        name,
      },
    });

    if (brandExist) {
      throw new BadRequestException(
        'Trademark with that name has already been registered',
      );
    }

    const slug = convertToSlug(createBrandDto.name);
    const brand = await this.prisma.brands.create({
      data: {
        ...createBrandDto,
        slug,
      },
    });

    return {
      message: 'Trademark created successfully',
      brand,
    };
  }

  async findAll() {
    const brands = await this.prisma.brands.findMany();

    return {
      brands,
    };
  }

  async findOne(term: string) {
    const brand = await this.prisma.brands.findFirst({
      where: {
        OR: [{ id: term }, { slug: term }],
      },
    });

    if (!brand) {
      throw new NotFoundException('Trademark not found');
    }

    return {
      brand,
    };
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const { name } = updateBrandDto;
    const brandExist = await this.prisma.brands.findFirst({
      where: {
        id,
      },
    });

    if (!brandExist) {
      throw new NotFoundException('Trademark not found');
    }

    if (name) {
      const slug = convertToSlug(name);
      const brand = await this.prisma.brands.update({
        where: {
          id,
        },
        data: {
          ...updateBrandDto,
          slug,
        },
      });

      return {
        message: 'Trademark updated',
        brand,
      };
    }

    const brand = await this.prisma.brands.update({
      where: {
        id,
      },
      data: updateBrandDto,
    });

    return {
      message: 'Trademark updated',
      brand,
    };
  }

  async remove(id: string) {
    const brandExist = await this.prisma.brands.findFirst({
      where: {
        id,
      },
    });

    if (!brandExist) {
      throw new NotFoundException('Trademark not found');
    }

    const deleteBrand = await this.prisma.brands.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Trademark deleted',
      deleteBrand,
    };
  }
}
