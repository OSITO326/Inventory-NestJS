import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertToSlug } from 'src/common/helpers/convert-to-slug';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { categories, trademarksId, name, ...productData } = createProductDto;

    // Verify ID of trademark (trademarksId) is valid
    const validTrademark = await this.prisma.trademarks.findUnique({
      where: {
        id: trademarksId,
      },
    });
    if (!validTrademark) {
      throw new Error('Trademark provided does not exits in the database');
    }

    // Verify IDs of categories are valid
    const validCategories = await this.prisma.categories.findMany({
      where: {
        id: {
          in: categories,
        },
      },
    });
    if (validCategories.length !== categories.length) {
      throw new Error('Some categories doesnt exist on database');
    }

    // TODO:
    // search service image
    // DO: image??

    // Create product and link trademark and categories
    const slug = convertToSlug(name);
    const newProduct = await this.prisma.products.create({
      data: {
        name,
        slug,
        ...productData,
        Trademarks: {
          connect: { id: trademarksId }, // Relation with trademark
        },
        Categories: {
          create: categories.map((categoryId) => ({
            categoriesId: categoryId,
          })),
        },
      },
      include: {
        Categories: {
          select: {
            Categories: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        Trademarks: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return {
      message: 'Products created successfully',
      newProduct,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, search } = paginationDto;
    if (!search) {
      const totalProducts = await this.prisma.products.count();
      const lastPage = Math.ceil(totalProducts / limit);

      const products = await this.prisma.products.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          Categories: {
            select: {
              Categories: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          Trademarks: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      return {
        products,
        meta: {
          total: totalProducts,
          page,
          lastPage,
        },
      };
    }

    const totalProducts = await this.prisma.products.count({
      where: {
        OR: [
          { id: { contains: search } },
          { name: { contains: search } },
          { sku: { contains: search } },
        ],
      },
    });
    const lastPage = Math.ceil(totalProducts / limit);
    const products = await this.prisma.products.findMany({
      where: {
        OR: [
          { id: { contains: search } },
          { name: { contains: search } },
          { sku: { contains: search } },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        Categories: {
          select: {
            categoriesId: true,
            Categories: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        Trademarks: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return {
      products,
      meta: {
        total: totalProducts,
        page,
        lastPage,
      },
    };
  }

  async findOne(term: string) {
    try {
      const product = await this.prisma.products.findFirst({
        where: {
          OR: [{ id: term }, { slug: term }],
        },
      });
      if (!product) {
        throw new BadRequestException('Product not found');
      }

      return {
        product,
      };
    } catch (error) {
      throw new BadRequestException({
        message: 'An error occurred',
        error,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { categories, trademarksId, name, ...productData } = updateProductDto;

    // Verify if product exist
    const productExist = await this.prisma.products.findFirst({
      where: {
        id,
      },
    });

    if (!productExist) {
      throw new BadRequestException(`Product with ID ${id} not found`);
    }

    // Verify if trademarksId are valid
    if (trademarksId) {
      const validTrademark = await this.prisma.trademarks.findUnique({
        where: {
          id: trademarksId,
        },
      });

      if (!validTrademark) {
        throw new BadRequestException('Invalid trademark ID provided');
      }
    }

    // Verify if categories are valid
    if (categories && categories.length > 0) {
      const validCategories = await this.prisma.categories.findMany({
        where: {
          id: { in: categories },
        },
      });

      if (validCategories.length !== categories.length) {
        throw new BadRequestException(
          'Some categories do not exist in the database',
        );
      }
    }

    // Generate slug if provide new name
    const slug = name ? convertToSlug(name) : undefined;

    // Update product
    const updateProduct = await this.prisma.products.update({
      where: {
        id,
      },
      data: {
        ...productData,
        ...(name && { name, slug }),
        ...(trademarksId && {
          Trademarks: {
            connect: {
              id: trademarksId, // connect with new trademark
            },
          },
        }),
        ...(categories && {
          Categories: {
            deleteMany: {}, // Delete actual relationships
            create: categories.map((categoryId) => ({
              categoriesId: categoryId,
            })), // Create new relationships
          },
        }),
      },
      include: {
        Categories: {
          select: {
            Categories: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        Trademarks: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return {
      message: 'Product updated successfully',
      updateProduct,
    };
  }

  async remove(id: string) {
    // Verify if product exists
    const productExist = await this.prisma.products.findUnique({
      where: {
        id,
      },
    });

    if (!productExist) {
      throw new BadRequestException(`Product with ID ${id} not found`);
    }

    // Delete product and relationships
    const deleteProduct = await this.prisma.products.delete({
      where: {
        id,
      },
    });
    // this block if schema.prisma categoriesOnProducts not set delete on Cascade
    /* const deleteProduct = await this.prisma.$transaction([
      // delete relationships
      this.prisma.categoriesOnProducts.deleteMany({
        where: {
          productsId: id,
        },
      }),
      // delete product
      this.prisma.products.delete({
        where: {
          id,
        },
      }),
    ]); */

    return {
      message: `Product wiht ID ${id} has been removed successfully`,
      deleteProduct,
    };
  }
}
