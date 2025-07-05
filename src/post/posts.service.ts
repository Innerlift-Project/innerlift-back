// posts.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// Adjust the import paths below if your DTO files are in a 'dto' folder:
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}


  async create(createPostDto: CreatePostDto, authorId: string) {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            profilePicture: true,
          },
        },
        _count: {
          select: {
            reactions: true,
            coments: true,
            reports: true,
          },
        },
      },
    });
  }

  async findAll(queryDto: QueryPostsDto) {
    const page = Number(queryDto.page) || 1;
    const limit = Number(queryDto.limit) || 10;
    const skip = (page - 1) * limit;
    const { search, tags, authorId } = queryDto;
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tags && typeof tags === 'string') {
      where.tags = {
        hasEvery: [tags],
      };
    } else if (tags && Array.isArray(tags) && tags.length > 0) {
      where.tags = {
        hasEvery: tags,
      };
    }

    if (authorId) {
      where.authorId = authorId;
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              profilePicture: true,
            },
          },
          _count: {
            select: {
              reactions: true,
              coments: true,
              reports: true,
            },
          },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            profilePicture: true,
          },
        },
        coments: {
          include: {
            author: {
              select: {
                id: true,
                fullName: true,
                profilePicture: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
        _count: {
          select: {
            reactions: true,
            coments: true,
            reports: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('Você só pode editar seus próprios posts');
    }

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            profilePicture: true,
          },
        },
        _count: {
          select: {
            reactions: true,
            coments: true,
            reports: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('Você só pode deletar seus próprios posts');
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }

  // Comentários
  async createComment(postId: string, createCommentDto: CreateCommentDto, authorId: string) {
    // Verificar se o post existe
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return this.prisma.comment.create({
      data: {
        ...createCommentDto,
        authorId,
        postId,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });

    if (!comment) {
      throw new NotFoundException('Comentário não encontrado');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('Você só pode deletar seus próprios comentários');
    }

    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }

  // Reações
  async createReaction(postId: string, createReactionDto: CreateReactionDto, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    try {
      return await this.prisma.reaction.create({
        data: {
          ...createReactionDto,
          userId,
          postId,
        },
      });
    } catch (error) {
      // Se já existe uma reação, atualizar
      return this.prisma.reaction.updateMany({
        where: {
          userId,
          postId,
        },
        data: {
          type: createReactionDto.type,
        },
      });
    }
  }

  async deleteReaction(postId: string, userId: string) {
    const reaction = await this.prisma.reaction.findFirst({
      where: {
        userId,
        postId,
      },
    });

    if (!reaction) {
      throw new NotFoundException('Reação não encontrada');
    }

    return this.prisma.reaction.delete({
      where: {
        id: reaction.id,
      },
    });
  }

  // Denúncias
  async createReport(postId: string, createReportDto: CreateReportDto, reporterId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return this.prisma.report.create({
      data: {
        ...createReportDto,
        reporterId,
        postId,
      },
    });
  }

  // Buscar posts por tags
  async findByTags(tags: string[] | string) {
    const tagsArray = Array.isArray(tags) ? tags : [tags];
    return this.prisma.post.findMany({
      where: {
        tags: {
          hasEvery: tagsArray,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            profilePicture: true,
          },
        },
        _count: {
          select: {
            reactions: true,
            coments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Buscar posts populares (mais reações)
  async findPopular(limit: number = 10) {
    const take = Number(limit) || 10;
    return this.prisma.post.findMany({
      take,
      orderBy: {
        reactions: {
          _count: 'desc',
        },
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            profilePicture: true,
          },
        },
        _count: {
          select: {
            reactions: true,
            coments: true,
          },
        },
      },
    });
  }
}