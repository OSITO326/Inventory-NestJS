import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrademarkDto } from './dto/create-trademark.dto';
import { UpdateTrademarkDto } from './dto/update-trademark.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertToSlug } from 'src/common/helpers/convert-to-slug';

@Injectable()
export class TrademarksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTrademarkDto: CreateTrademarkDto) {
    try {
      const { name } = createTrademarkDto;
      const trademarkExist = await this.prisma.trademarks.findFirst({
        where: {
          name,
        },
      });

      if (trademarkExist) {
        throw new BadRequestException({
          message: 'Trademark with that name has already been registered',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      const slug = convertToSlug(name);
      const trademark = await this.prisma.trademarks.create({
        data: {
          ...createTrademarkDto,
          slug,
        },
      });

      return {
        message: 'Trademark created successfully',
        trademark,
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
      const trademarks = await this.prisma.trademarks.findMany();

      return {
        trademarks,
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
      const trademark = await this.prisma.trademarks.findFirst({
        where: {
          OR: [{ id: term }, { slug: term }],
        },
      });

      if (!trademark) {
        throw new NotFoundException('Trademark not found');
      }

      return {
        trademark,
      };
    } catch (error) {
      throw new BadRequestException({
        message: 'An error occurred',
        error,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }

  async update(id: string, updateTrademarkDto: UpdateTrademarkDto) {
    try {
      const { name } = updateTrademarkDto;
      const trademarkExist = await this.prisma.trademarks.findFirst({
        where: {
          id,
        },
      });

      if (!trademarkExist) {
        throw new NotFoundException('Trademark not found');
      }

      if (name) {
        const slug = convertToSlug(name);
        const brand = await this.prisma.trademarks.update({
          where: {
            id,
          },
          data: {
            ...updateTrademarkDto,
            slug,
          },
        });

        return {
          message: 'Trademark updated',
          brand,
        };
      }

      const trademark = await this.prisma.trademarks.update({
        where: {
          id,
        },
        data: updateTrademarkDto,
      });

      return {
        message: 'Trademark updated',
        trademark,
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
      const trademarkExist = await this.prisma.trademarks.findFirst({
        where: {
          id,
        },
      });

      if (!trademarkExist) {
        throw new NotFoundException('Trademark not found');
      }

      const deleteTrademark = await this.prisma.trademarks.delete({
        where: {
          id,
        },
      });

      return {
        message: 'Trademark deleted',
        deleteTrademark,
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
