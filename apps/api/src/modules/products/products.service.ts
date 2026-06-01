import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { ProductFilterDto } from './dto/product-filter.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: ProductFilterDto) {
    const {
      page = 1,
      limit = 20,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isFeatured,
      tags,
    } = filter;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(category && { category }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            basePrice: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          }
        : {}),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { shortDescription: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(tags?.length && {
        tags: { some: { tag: { in: tags } } },
      }),
    };

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        select: {
          id: true,
          slug: true,
          name: true,
          sku: true,
          shortDescription: true,
          basePrice: true,
          compareAtPrice: true,
          leasePriceMonth: true,
          category: true,
          isFeatured: true,
          requiresQuote: true,
          specifications: true,
          images: {
            where: { isPrimary: true },
            select: { url: true, altText: true },
            take: 1,
          },
          tags: { select: { tag: true } },
          inventoryItems: {
            select: { quantityOnHand: true, quantityReserved: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products.map((p) => ({
        ...p,
        inStock: p.inventoryItems.some((i) => i.quantityOnHand - i.quantityReserved > 0),
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true } },
        tags: true,
        options: {
          include: { choices: true },
          orderBy: { sortOrder: 'asc' },
        },
        inventoryItems: {
          select: { quantityOnHand: true, quantityReserved: true },
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: { select: { firstName: true, lastName: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) throw new NotFoundException(`Product not found: ${slug}`);

    const totalStock = product.inventoryItems.reduce(
      (sum, i) => sum + i.quantityOnHand - i.quantityReserved,
      0,
    );
    const avgRating = product.reviews.length
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : null;

    return { ...product, totalStock, avgRating };
  }

  async compareProducts(ids: string[]) {
    if (ids.length < 2 || ids.length > 4) {
      throw new BadRequestException('Compare between 2 and 4 products');
    }

    return this.prisma.product.findMany({
      where: { id: { in: ids }, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        basePrice: true,
        category: true,
        specifications: true,
        images: {
          where: { isPrimary: true },
          select: { url: true, altText: true },
          take: 1,
        },
      },
    });
  }

  async create(dto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: {
        sku: dto.sku,
        name: dto.name,
        slug: dto.slug,
        shortDescription: dto.shortDescription,
        description: dto.description,
        category: dto.category,
        basePrice: dto.basePrice,
        compareAtPrice: dto.compareAtPrice,
        leasePriceMonth: dto.leasePriceMonth,
        specifications: dto.specifications ?? {},
        isConfigurable: dto.isConfigurable ?? false,
        requiresQuote: dto.requiresQuote ?? false,
        taxCode: dto.taxCode,
        weight: dto.weight,
        dimensions: dto.dimensions,
        modelUrl: dto.modelUrl,
        modelFormat: dto.modelFormat,
        videoUrl: dto.videoUrl,
        images: dto.images ? { create: dto.images } : undefined,
        tags: dto.tags ? { create: dto.tags.map((tag) => ({ tag })) } : undefined,
      },
    });
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    await this.prisma.product.findUniqueOrThrow({ where: { id } });
    const { images, tags, ...scalar } = dto;
    return this.prisma.product.update({
      where: { id },
      data: {
        ...scalar,
        ...(images && {
          images: { deleteMany: {}, create: images },
        }),
        ...(tags && {
          tags: { deleteMany: {}, create: tags.map((tag) => ({ tag })) },
        }),
      },
    });
  }

  async buildConfiguration(productId: string, selections: Record<string, string>, userId?: string) {
    const product = await this.prisma.product.findUniqueOrThrow({
      where: { id: productId },
      include: { options: { include: { choices: true } } },
    });

    if (!product.isConfigurable) {
      throw new BadRequestException('Product is not configurable');
    }

    let totalPrice = Number(product.basePrice);
    const validatedSelections: Record<string, string> = {};

    for (const option of product.options) {
      const selectedValue = selections[option.id];

      if (option.required && !selectedValue) {
        throw new BadRequestException(`Option "${option.name}" is required`);
      }

      if (selectedValue) {
        const choice = option.choices.find((c) => c.id === selectedValue);
        if (!choice) {
          throw new BadRequestException(`Invalid choice for option "${option.name}"`);
        }
        totalPrice += Number(choice.priceDelta);
        validatedSelections[option.id] = choice.id;
      }
    }

    return this.prisma.configuration.create({
      data: {
        userId: userId ?? null,
        productId,
        selections: validatedSelections,
        totalPrice,
      },
    });
  }
}
